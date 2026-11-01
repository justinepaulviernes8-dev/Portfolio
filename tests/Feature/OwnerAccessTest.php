<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Support\OwnerAccess;
use Database\Seeders\ProjectSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class OwnerAccessTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
        config(['portfolio.auth_required' => true, 'portfolio.owner_email' => 'owner@example.test',
            'portfolio.owner_password_hash' => Hash::make('private-test-password')]);
    }

    public function test_public_records_remain_visible_but_every_crud_route_requires_owner(): void
    {
        $this->seed(ProjectSeeder::class);
        $id = Project::firstOrFail()->id;
        $this->get('/')->assertOk()->assertInertia(fn (Assert $page) => $page->has('projects', 5)->where('management.canManage', false));
        foreach (['/projects', '/projects/create', "/projects/$id/edit"] as $url) $this->get($url)->assertRedirect('/login');
        $this->post('/projects', [])->assertRedirect('/login');
        $this->put("/projects/$id", [])->assertRedirect('/login');
        $this->delete("/projects/$id")->assertRedirect('/login');
        $this->assertDatabaseCount('projects', 5);
    }

    public function test_owner_can_log_in_manage_and_log_out(): void
    {
        $this->get('/login')->assertOk()->assertInertia(fn (Assert $page) => $page->component('Auth/Login'));
        $this->post('/login', ['email' => 'owner@example.test', 'password' => 'private-test-password'])->assertRedirect('/projects');
        $this->get('/projects')->assertOk();
        $this->get('/')->assertInertia(fn (Assert $page) => $page->where('management.canManage', true));
        $this->post('/logout')->assertRedirect('/');
        $this->get('/projects')->assertRedirect('/login');
    }

    public function test_invalid_credentials_and_unconfigured_owner_cannot_log_in(): void
    {
        foreach ([['email' => 'owner@example.test', 'password' => 'incorrect'],
            ['email' => 'other@example.test', 'password' => 'private-test-password']] as $credentials) {
            $this->post('/login', $credentials)->assertSessionHasErrors('email')->assertSessionMissing('portfolio_owner');
        }
        config(['portfolio.owner_password_hash' => null]);
        $this->post('/login', ['email' => 'owner@example.test', 'password' => 'private-test-password'])
            ->assertSessionHasErrors('email')->assertSessionMissing('portfolio_owner');
    }

    public function test_changing_owner_credentials_revokes_existing_sessions(): void
    {
        $this->withSession(['portfolio_owner' => OwnerAccess::fingerprint()])->get('/projects')->assertOk();
        config(['portfolio.owner_password_hash' => Hash::make('different-test-password')]);
        $this->get('/projects')->assertRedirect('/login');
    }

    public function test_production_cannot_disable_owner_protection(): void
    {
        config(['portfolio.auth_required' => false]);
        $this->app->instance('env', 'production');
        $this->get('/projects')->assertRedirect('/login');
    }

    public function test_login_attempts_are_rate_limited(): void
    {
        for ($i = 0; $i < 5; $i++) {
            $this->post('/login', ['email' => 'owner@example.test', 'password' => 'incorrect'])->assertSessionHasErrors('email');
        }
        $this->post('/login', ['email' => 'owner@example.test', 'password' => 'incorrect'])->assertStatus(429);
    }

    public function test_configured_external_disk_handles_upload_replacement_urls_and_deletion(): void
    {
        config(['portfolio.upload_disk' => 's3']);
        Storage::fake('s3');
        $this->seed(ProjectSeeder::class);
        $project = Project::firstOrFail();
        $data = $project->only(['title', 'category', 'description', 'details', 'tech_stack', 'image_alt', 'image_fit', 'display_order']);
        $data['image'] = UploadedFile::fake()->image('external.png');
        $this->withSession(['portfolio_owner' => OwnerAccess::fingerprint()])
            ->post('/projects/'.$project->id, [...$data, '_method' => 'put'])->assertSessionHasNoErrors();
        $project->refresh();
        Storage::disk('s3')->assertExists($project->image_path);
        $this->assertSame(Storage::disk('s3')->url($project->image_path), $project->image_url);
        $oldPath = $project->image_path;
        $data['image'] = UploadedFile::fake()->image('replacement.png');
        $this->post('/projects/'.$project->id, [...$data, '_method' => 'put'])->assertSessionHasNoErrors();
        Storage::disk('s3')->assertMissing($oldPath);
        $newPath = $project->fresh()->image_path;
        $this->delete('/projects/'.$project->id)->assertRedirect('/projects');
        Storage::disk('s3')->assertMissing($newPath);
    }
}
