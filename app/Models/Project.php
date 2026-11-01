<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'category', 'description', 'details', 'tech_stack',
        'image_path', 'image_alt', 'image_fit', 'display_order',
    ];

    protected $appends = ['image_url'];

    protected function casts(): array
    {
        return ['display_order' => 'integer'];
    }

    public function getImageUrlAttribute(): string
    {
        return str_starts_with($this->image_path, 'images/')
            ? asset($this->image_path)
            : Storage::disk('public')->url($this->image_path);
    }
}
