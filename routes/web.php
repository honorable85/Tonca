<?php 
use Clicalmani\Flesco\Routes\Route;
use Clicalmani\Flesco\Database\DB;

Route::middleware('authenticate');

Route::get('/user', function($request) {
    echo 'User';
});