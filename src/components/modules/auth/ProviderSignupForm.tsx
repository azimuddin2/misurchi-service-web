'use client';

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

const ProviderSignupForm = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md">
            <div className="text-xs text-gray-500 uppercase font-semibold">Let's get you started</div>
            <h2 className="text-2xl font-semibold mb-6">Sign Up to your Account</h2>

            {/* Social Buttons */}
            <div className="space-y-3">
                <Button variant="outline" className="w-full flex gap-2 justify-center bg-gradient-to-r from-blue-100 to-green-100">
                    <img src="/google.svg" alt="Google" className="w-5 h-5" />
                    Sign In with Google
                </Button>
                <Button variant="outline" className="w-full flex gap-2 justify-center">
                    <span>📞</span>
                    Sign In with Phone Number
                </Button>
            </div>

            <div className="my-4 text-center text-xs text-gray-500">OR USE</div>

            {/* Form Inputs */}
            <form className="space-y-4">
                <div>
                    <Label>Business Name</Label>
                    <Input placeholder="Enter your business name" />
                </div>

                <div>
                    <Label>Email Address</Label>
                    <Input type="email" placeholder="Enter business email address" />
                </div>

                <div>
                    <Label>Phone Number</Label>
                    <Input type="tel" placeholder="Enter business phone number" />
                </div>

                <div>
                    <Label>Country</Label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="usa">USA</SelectItem>
                            <SelectItem value="bd">Bangladesh</SelectItem>
                            <SelectItem value="uk">UK</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Street</Label>
                    <Input placeholder="Enter your street address" />
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <Label>State</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="State" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="dhaka">Dhaka</SelectItem>
                                <SelectItem value="ny">New York</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1">
                        <Label>Zip Code</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Zip Code" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="12345">12345</SelectItem>
                                <SelectItem value="54321">54321</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div>
                    <Label>Currency</Label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Currency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="usd">USD</SelectItem>
                            <SelectItem value="bdt">BDT</SelectItem>
                            <SelectItem value="eur">EUR</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <Label>Time Zone</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Time Zone" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="utc+6">UTC+6</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1">
                        <Label>Work Hours</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Work Hours" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="9-5">9AM - 5PM</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <Label>First Name</Label>
                        <Input placeholder="First Name" />
                    </div>
                    <div className="flex-1">
                        <Label>Last Name</Label>
                        <Input placeholder="Last Name" />
                    </div>
                </div>

                <div className="relative">
                    <Label>Password</Label>
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                    />
                    <span
                        className="absolute top-[38px] right-3 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </span>
                </div>

                <div className="relative">
                    <Label>Confirm Password</Label>
                    <Input
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Enter your confirm password"
                    />
                    <span
                        className="absolute top-[38px] right-3 cursor-pointer"
                        onClick={() => setShowConfirm(!showConfirm)}
                    >
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </span>
                </div>

                {/* Password requirements */}
                <ul className="text-xs text-gray-500 space-y-1 pl-2 list-disc">
                    <li>Minimum of 8 characters</li>
                    <li>At least one uppercase letter</li>
                    <li>At least one lowercase letter</li>
                    <li>At least one number</li>
                    <li>At least one special character (e.g., !@#$%^&*)</li>
                </ul>

                <Button className="w-full mt-4 bg-gradient-to-r from-green-400 to-emerald-600">
                    SIGN UP →
                </Button>

                <p className="text-center text-sm mt-4">
                    Have an account?{' '}
                    <a href="/login" className="text-black font-medium underline">
                        SIGN IN HERE
                    </a>
                </p>
            </form>
        </div>
    );
};

export default ProviderSignupForm;