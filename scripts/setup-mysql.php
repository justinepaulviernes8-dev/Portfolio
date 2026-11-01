<?php

// Create the configured XAMPP database, migrate it, then preserve existing records.
// Never drops tables, resets a database, or overwrites existing MySQL projects.
require __DIR__.'/../vendor/autoload.php';
$app = require __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

if (config('database.default') !== 'mysql') {
    throw new RuntimeException('Set DB_CONNECTION=mysql in .env before running this script.');
}
$connection = config('database.connections.mysql');
$database = $connection['database'];
if (!preg_match('/^[A-Za-z0-9_]+$/', $database)) {
    throw new RuntimeException('Use only letters, digits and underscores in DB_DATABASE.');
}
$pdo = new PDO(
    'mysql:host='.$connection['host'].';port='.$connection['port'].';charset=utf8mb4',
    $connection['username'],
    $connection['password'],
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION],
);
$pdo->exec("CREATE DATABASE IF NOT EXISTS `$database` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
if ($kernel->call('migrate', ['--force' => true]) !== 0) {
    echo $kernel->output();
    throw new RuntimeException('Migration failed; no projects were imported.');
}
echo $kernel->output();

if (Illuminate\Support\Facades\DB::table('projects')->exists()) {
    echo "Existing MySQL projects found. No records were overwritten.\n";
    exit(0);
}

$sqlitePath = database_path('database.sqlite');
$records = [];
if (is_file($sqlitePath)) {
    $sqlite = new PDO('sqlite:'.$sqlitePath, options: [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $hasProjects = $sqlite->query("SELECT name FROM sqlite_master WHERE type='table' AND name='projects'")->fetchColumn();
    if ($hasProjects) $records = $sqlite->query('SELECT * FROM projects ORDER BY id')->fetchAll(PDO::FETCH_ASSOC);
}
if ($records) {
    Illuminate\Support\Facades\DB::transaction(function () use ($records): void {
        foreach ($records as $record) {
            Illuminate\Support\Facades\DB::table('projects')->insert($record);
        }
    });
    echo 'Imported '.count($records)." existing projects from SQLite. The SQLite file remains untouched.\n";
} else {
    $kernel->call('db:seed', ['--force' => true]);
    echo $kernel->output();
}
echo 'Database ready: '.$database.' ('.Illuminate\Support\Facades\DB::selectOne('SELECT VERSION() AS version')->version.")\n";
