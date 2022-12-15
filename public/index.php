<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';

try {
    return Clicalmani\Flesco\Http\Controllers\RequestController::render(); 
} catch (Clicalmani\Flesco\Exceptions\RouteNotFoundException $e) {

    /**
     * Ressource file request
     */

    if ( file_exists( dirname( __FILE__ ) . $_SERVER['REQUEST_URI'] ) ) {
        header('Location: /public/' . $_SERVER['REQUEST_URI']); exit;
    } else http_response_code(404);
}