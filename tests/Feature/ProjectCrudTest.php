<?php

namespace Tests\Feature;

use App\Models\Project;
use Database\Seeders\ProjectSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProjectCrudTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
        Storage::fake('public');
    }

    private function payload(array $overrides = []): array
    {
        return array_replace([
            'title' => 'Validation Demo Project', 'category' => 'Web Development',
            'description' => 'A project used to exercise the complete CRUD workflow.',
            'details' => 'A longer explanation of the project, implementation and lessons learned.',
            'tech_stack' => 'Laravel, React', 'image_alt' => 'Screenshot of the validation demo',
            'image_fit' => 'cover', 'display_order' => 5,
            'image' => UploadedFile::fake()->image('project.png', 320, 180),
        ], $overrides);
    }

    private function record(): Project
    {
        $data = $this->payload();
        unset($data['image']);
        return Project::create([...$data, 'image_path' => 'images/projects/Laravel.png']);
    }

    public function test_seeded_projects_and_all_pages_are_available(): void
    {
        $this->seed(ProjectSeeder::class);
        $this->get('/')->assertOk()->assertInertia(fn (Assert $page) => $page->component('Portfolio')->has('projects', 5)->where('projects.0.title', 'Campus Found: Lost & Found System'));
        $this->get('/projects')->assertOk()->assertInertia(fn (Assert $page) => $page->component('Projects/Index')->has('projects', 5));
        $this->get('/projects/create')->assertOk()->assertInertia(fn (Assert $page) => $page->component('Projects/Create'));
        $this->get('/projects/'.Project::first()->id.'/edit')->assertOk()->assertInertia(fn (Assert $page) => $page->component('Projects/Edit'));
    }

    public function test_create_saves_image_flashes_success_and_appears_publicly(): void
    {
        $this->post('/projects', $this->payload())->assertRedirect('/projects')->assertSessionHas('success', 'Project created successfully.');
        $project = Project::firstOrFail();
        Storage::disk('public')->assertExists($project->image_path);
        $this->get('/')->assertInertia(fn (Assert $page) => $page->has('projects', 1)->where('projects.0.title', $project->title));
    }

    public function test_empty_form_returns_errors_for_every_required_field(): void
    {
        $this->from('/projects/create')->post('/projects', [])->assertRedirect('/projects/create')->assertSessionHasErrors(['title','category','description','details','tech_stack','image_alt','image_fit','display_order','image']);
        $this->assertDatabaseCount('projects', 0);
    }

    public function test_title_over_maximum_length_is_rejected(): void
    {
        $this->post('/projects', $this->payload(['title' => str_repeat('a', 121)]))->assertSessionHasErrors('title');
        $this->assertDatabaseCount('projects', 0);
    }

    public function test_short_descriptions_are_rejected_with_custom_message(): void
    {
        $this->post('/projects', $this->payload(['description' => 'short']))->assertSessionHasErrors(['description' => 'Describe your project in at least 10 characters.']);
    }

    public function test_order_requires_an_integer_in_range(): void
    {
        foreach (['letters', 1.5, -1, 0, 101, 1000] as $value) {
            $this->post('/projects', $this->payload(['display_order' => $value]))->assertSessionHasErrors('display_order');
        }
        $this->assertDatabaseCount('projects', 0);
    }

    public function test_duplicate_title_is_rejected(): void
    {
        $project = $this->record();
        $this->post('/projects', $this->payload(['title' => $project->title]))->assertSessionHasErrors('title');
        $this->assertDatabaseCount('projects', 1);
    }

    public function test_zero_is_rejected_on_update_and_one_is_allowed(): void
    {
        $project = $this->record();
        $this->put('/projects/'.$project->id, $this->payload(['image' => null, 'display_order' => 0]))
            ->assertSessionHasErrors(['display_order' => 'Display order must be between 1 and 100. Choose a number other than 0.']);
        $this->assertSame(5, $project->fresh()->display_order);
        $this->put('/projects/'.$project->id, $this->payload(['image' => null, 'display_order' => 1]))->assertSessionHasNoErrors();
        $this->assertSame(1, $project->fresh()->display_order);
    }

    public function test_display_order_one_hundred_is_allowed_but_one_hundred_one_is_rejected_on_update(): void
    {
        $this->post('/projects', $this->payload(['display_order' => 100]))->assertSessionHasNoErrors();
        $project = Project::firstOrFail();
        $this->assertSame(100, $project->display_order);
        $this->put('/projects/'.$project->id, $this->payload(['image' => null, 'display_order' => 101]))->assertSessionHasErrors('display_order');
        $this->assertSame(100, $project->fresh()->display_order);
    }

    public function test_legacy_order_migration_preserves_carousel_sequence(): void
    {
        $first = $this->record();
        $first->update(['display_order' => 0]);
        $second = $first->replicate();
        $second->title = 'Second legacy project';
        $second->display_order = 1;
        $second->save();
        $migration = require database_path('migrations/2026_11_03_000001_start_project_order_at_one.php');
        $migration->up();
        $this->assertSame([$first->id, $second->id], Project::orderBy('display_order')->pluck('id')->all());
        $this->assertSame([1, 2], Project::orderBy('display_order')->pluck('display_order')->all());
    }

    public function test_create_rejects_another_projects_display_order(): void
    {
        $project = $this->record();
        $this->from('/')->post('/projects', $this->payload(['title' => 'Different title', 'display_order' => $project->display_order]))
            ->assertRedirect('/')
            ->assertSessionHasErrors(['display_order' => 'This display order is already used by another project. Choose a different number.'])
            ->assertSessionHasInput('title', 'Different title');
        $this->assertDatabaseCount('projects', 1);
        $this->get('/')->assertInertia(fn (Assert $page) => $page->where('errors.display_order', 'This display order is already used by another project. Choose a different number.'));
    }

    public function test_update_rejects_another_projects_order_but_accepts_an_unused_order(): void
    {
        $first = $this->record();
        $second = $first->replicate();
        $second->title = 'Second project';
        $second->display_order = 6;
        $second->save();

        $this->put('/projects/'.$second->id, $this->payload(['title' => $second->title, 'image' => null, 'display_order' => $first->display_order]))
            ->assertSessionHasErrors('display_order');
        $this->assertSame(6, $second->fresh()->display_order);

        $this->put('/projects/'.$second->id, $this->payload(['title' => $second->title, 'image' => null, 'display_order' => 7]))
            ->assertSessionHasNoErrors()->assertSessionHas('success', 'Project updated successfully.');
        $this->assertSame(7, $second->fresh()->display_order);
    }

    public function test_unchanged_unique_title_saves_and_keeps_image(): void
    {
        $project = $this->record();
        $this->put('/projects/'.$project->id, $this->payload(['image' => null, 'description' => 'Updated description for this project.']))->assertRedirect('/projects')->assertSessionHasNoErrors()->assertSessionHas('success', 'Project updated successfully.');
        $this->assertSame('images/projects/Laravel.png', $project->fresh()->image_path);
        $this->get('/')->assertInertia(fn (Assert $page) => $page->where('projects.0.description', 'Updated description for this project.'));
    }

    public function test_update_cannot_take_another_projects_title(): void
    {
        $first = $this->record();
        $second = $first->replicate();
        $second->title = 'Another project';
        $second->save();
        $this->put('/projects/'.$second->id, $this->payload(['image' => null]))->assertSessionHasErrors('title');
        $this->assertSame('Another project', $second->fresh()->title);
    }

    public function test_non_image_disallowed_image_type_and_large_upload_are_rejected(): void
    {
        foreach ([UploadedFile::fake()->create('fake.png', 50, 'text/plain'), UploadedFile::fake()->image('image.gif'), UploadedFile::fake()->image('large.png')->size(4097)] as $file) {
            $this->post('/projects', $this->payload(['image' => $file]))->assertSessionHasErrors('image');
        }
        $this->assertDatabaseCount('projects', 0);
        $this->assertEmpty(Storage::disk('public')->allFiles());
    }

    public function test_failed_validation_preserves_old_input_and_inertia_field_errors(): void
    {
        $this->from('/projects/create')->post('/projects', $this->payload(['title' => '', 'description' => 'Keep this description after failure.']))->assertRedirect('/projects/create')->assertSessionHasInput('description', 'Keep this description after failure.');
        $this->get('/projects/create')->assertInertia(fn (Assert $page) => $page->where('errors.title', 'Please give your project a title.'));
    }

    public function test_image_replacement_removes_old_upload_and_delete_removes_new_upload(): void
    {
        $this->post('/projects', $this->payload());
        $project = Project::firstOrFail();
        $old = $project->image_path;
        $this->post('/projects/'.$project->id, $this->payload(['_method' => 'put']))->assertRedirect('/projects')->assertSessionHasNoErrors();
        $new = $project->fresh()->image_path;
        $this->assertNotSame($old, $new);
        Storage::disk('public')->assertMissing($old);
        Storage::disk('public')->assertExists($new);
        $this->delete('/projects/'.$project->id)->assertRedirect('/projects')->assertSessionHas('success', 'Project deleted successfully.');
        Storage::disk('public')->assertMissing($new);
        $this->get('/')->assertInertia(fn (Assert $page) => $page->has('projects', 0));
    }

    public function test_deleting_seed_record_keeps_original_asset(): void
    {
        $project = $this->record();
        Storage::disk('public')->put('images/projects/Laravel.png', 'original');
        $this->delete('/projects/'.$project->id)->assertRedirect('/projects');
        Storage::disk('public')->assertExists('images/projects/Laravel.png');
        $this->assertFileExists(public_path('images/projects/Laravel.png'));
    }

    public function test_display_order_controls_public_order_and_ties_are_stable(): void
    {
        $first = $this->record();
        $second = $first->replicate(); $second->title = 'First in carousel'; $second->display_order = 0; $second->save();
        $this->get('/')->assertInertia(fn (Assert $page) => $page->where('projects.0.title', 'First in carousel')->where('projects.1.title', $first->title));
    }

    public function test_unknown_records_return_404(): void
    {
        $this->get('/projects/999/edit')->assertNotFound();
        $this->put('/projects/999', $this->payload())->assertNotFound();
        $this->delete('/projects/999')->assertNotFound();
    }

    public function test_unvalidated_fields_cannot_override_image_path(): void
    {
        $project = $this->record();
        $this->put('/projects/'.$project->id, $this->payload(['image' => null, 'image_path' => '../../private.txt']))->assertSessionHasNoErrors();
        $this->assertSame('images/projects/Laravel.png', $project->fresh()->image_path);
    }

    public function test_portfolio_create_returns_to_the_projects_section(): void
    {
        $this->from('/')->post('/projects', $this->payload(['return_to' => 'portfolio']))
            ->assertRedirect('/#projects')->assertSessionHas('success', 'Project created successfully.');
        $this->get('/')->assertInertia(fn (Assert $page) => $page->component('Portfolio')->has('projects', 1)->where('flash.success', 'Project created successfully.'));
    }

    public function test_portfolio_update_and_delete_return_to_the_same_section(): void
    {
        $project = $this->record();
        $this->post('/projects/'.$project->id, $this->payload(['_method' => 'put', 'image' => null, 'return_to' => 'portfolio']))
            ->assertRedirect('/#projects')->assertSessionHasNoErrors();
        $this->delete('/projects/'.$project->id, ['return_to' => 'portfolio'])
            ->assertRedirect('/#projects')->assertSessionHas('success', 'Project deleted successfully.');
        $this->assertDatabaseCount('projects', 0);
    }

    public function test_inline_validation_redirects_back_with_field_errors(): void
    {
        $this->from('/')->post('/projects', $this->payload(['title' => '', 'return_to' => 'portfolio']))
            ->assertRedirect('/')->assertSessionHasErrors('title')
            ->assertSessionHasInput('description', 'A project used to exercise the complete CRUD workflow.');
        $this->get('/')->assertInertia(fn (Assert $page) => $page->component('Portfolio')->where('errors.title', 'Please give your project a title.'));
    }

    public function test_submitted_return_destination_cannot_create_an_external_redirect(): void
    {
        $this->post('/projects', $this->payload(['return_to' => 'https://example.com']))
            ->assertRedirect('/projects')->assertSessionHasNoErrors();
    }
}
