<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Projects/Index', [
            'projects' => Project::orderBy('display_order')->orderBy('id')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Projects/Create', [
            'projectOrders' => Project::get(['id', 'display_order']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatedData($request);
        $path = $request->file('image')->store('projects', config('portfolio.upload_disk'));
        unset($data['image']);
        try {
            Project::create([...$data, 'image_path' => $path]);
        } catch (\Throwable $exception) {
            Storage::disk(config('portfolio.upload_disk'))->delete($path);
            throw $exception;
        }
        return $this->successResponse($request, 'Project created successfully.');
    }

    public function edit(Project $project): Response
    {
        return Inertia::render('Projects/Edit', [
            'project' => $project,
            'projectOrders' => Project::get(['id', 'display_order']),
        ]);
    }

    public function update(Request $request, Project $project): RedirectResponse
    {
        $data = $this->validatedData($request, $project);
        $oldPath = $project->image_path;
        $newPath = $request->hasFile('image')
            ? $request->file('image')->store('projects', config('portfolio.upload_disk')) : null;
        unset($data['image']);
        if ($newPath) $data['image_path'] = $newPath;
        try {
            $project->update($data);
        } catch (\Throwable $exception) {
            if ($newPath) Storage::disk(config('portfolio.upload_disk'))->delete($newPath);
            throw $exception;
        }
        if ($newPath) $this->deleteUploadedImage($oldPath);
        return $this->successResponse($request, 'Project updated successfully.');
    }

    public function destroy(Request $request, Project $project): RedirectResponse
    {
        $path = $project->image_path;
        $project->delete();
        $this->deleteUploadedImage($path);
        return $this->successResponse($request, 'Project deleted successfully.');
    }

    private function successResponse(Request $request, string $message): RedirectResponse
    {
        // Only accept a known destination; never redirect to an arbitrary submitted URL.
        $response = $request->input('return_to') === 'portfolio'
            ? redirect(rtrim(route('portfolio'), '/').'/#projects')
            : to_route('projects.index');

        return $response->with('success', $message);
    }

    private function validatedData(Request $request, ?Project $project = null): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:120', Rule::unique('projects', 'title')->ignore($project)],
            'category' => ['required', 'string', 'max:60'],
            'description' => ['required', 'string', 'min:10', 'max:500'],
            'details' => ['required', 'string', 'min:20', 'max:3000'],
            'tech_stack' => ['required', 'string', 'max:200'],
            'image_alt' => ['required', 'string', 'max:255'],
            'image_fit' => ['required', Rule::in(['cover', 'contain'])],
            'display_order' => ['required', 'integer', 'between:1,100', Rule::unique('projects', 'display_order')->ignore($project)],
            'image' => [$project ? 'nullable' : 'required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ], [
            'title.required' => 'Please give your project a title.',
            'title.unique' => 'A project with this title already exists. Choose a different title.',
            'description.min' => 'Describe your project in at least 10 characters.',
            'details.min' => 'Add at least 20 characters of project details.',
            'display_order.between' => 'Display order must be between 1 and 100. Choose a number other than 0.',
            'display_order.unique' => 'This display order is already used by another project. Choose a different number.',
            'image.required' => 'Choose a screenshot for your project.',
            'image.image' => 'The screenshot must be a real image.',
            'image.mimes' => 'Use a JPG, PNG, or WebP screenshot.',
            'image.max' => 'The screenshot must be 4 MB or smaller.',
        ]);
    }

    private function deleteUploadedImage(string $path): void
    {
        // Original version-controlled images are never deleted by the manager.
        if (str_starts_with($path, 'projects/')) Storage::disk(config('portfolio.upload_disk'))->delete($path);
    }
}
