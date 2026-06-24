<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::POST('/login', [AuthController::class, 'login']);
Route::POST('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
