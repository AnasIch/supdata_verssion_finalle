<?php
namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;
class PasswordResetLinkController extends Controller {
 public function create(){ return Inertia::render('Auth/ForgotPassword',['status'=>session('status')]); }
 public function store(ForgotPasswordRequest $request){ Password::sendResetLink(['email'=>$request->validated('email')]); return back()->with('status','password-reset-link-sent'); }
}
