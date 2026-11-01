<!doctype html>
<html lang="en" class="scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Portfolio of Justine Paul Viernes, student and aspiring web designer.">
    <link rel="icon" type="image/png" href="/images/logo/logo.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script>
        try {
            const saved = localStorage.getItem('theme');
            document.documentElement.classList.toggle('dark', saved ? saved === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches);
        } catch (_) {}
    </script>
    @viteReactRefresh
    @vite('resources/js/app.jsx')
    @inertiaHead
</head>
<body class="bg-white font-sans text-slate-900 antialiased transition-colors dark:bg-slate-950 dark:text-slate-100">
    @inertia
</body>
</html>
