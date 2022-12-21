<?php
Clicalmani\Flesco\Providers\ServiceProvider::$providers = [
    'users' => [
        'manage' => App\Providers\User::class
    ],
    'middleware' => [
        'web' => [
            'authenticate' => App\Http\Middleware\Authenticate::class,
            'authadmin'    => App\Http\Middleware\AuthAdmin::class
        ]
    ]
];