<?php
Clicalmani\Flesco\Providers\ServiceProvider::$providers = [
    'middleware' => [
        'web' => [
            'authenticate' => App\Http\Middleware\Authenticate::class,
            'authadmin'    => App\Http\Middleware\AuthAdmin::class
        ]
    ]
];