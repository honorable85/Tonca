<?php
use Clicalmani\Flesco\Routes\Route;
use App\Http\Controllers\TestController;

Route::get('/admin/:name', [TestController::class, 'index']);

Route::get('/admin/:name/:hsh', [TestController::class, 'hash']);