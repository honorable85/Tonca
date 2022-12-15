<?php
use Clicalmani\Flesco\Routes\Route;

Route::middleware('authadmin');

Route::get('/', function($request) {
    echo 'Home';
    return view( 'home', [
        'arg1' => 'Arg 1',
        'arg2' => 'Arg 2'
    ] );
});