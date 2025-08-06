import Link from 'next/link';
import { Check, X, ArrowRight } from 'lucide-react';

export default function Pricing() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-8">
          Choose Your Plan & Start Making an Impact!
        </h1>
        <div className="inline-flex border border-gray-300 rounded-full overflow-hidden">
          <button className="px-6 py-2 bg-white text-green-700 font-medium">
            Basic Plan
          </button>
          <button className="px-6 py-2 bg-white text-green-700 font-medium border-l border-gray-300">
            Advance Plan
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Basic Plan */}
        <div className="border border-gray-200 rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-center mb-2">Basic Plan</h2>
          <p className="text-gray-500 text-center mb-6">
            Unlimited to free subscription plan
          </p>

          <div className="bg-gradient-to-r from-green-500 to-green-500 text-white text-center py-4 rounded-md mb-8">
            <span className="text-3xl font-bold">Free</span>
          </div>

          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Cost: Free</span>
            </li>
            <li className="flex items-start">
              <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Add Team Members: No</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Validity: Unlimited</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Add Service Max: 10</span>
            </li>
            <li className="flex items-start">
              <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Grant permission Access: No</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Add Product Max: 10</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Transaction percentage: 7.5%</span>
            </li>
            <li className="flex items-start">
              <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Shared Calendar: No</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Highlight offering Max 1</span>
            </li>
            <li className="flex items-start">
              <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Task Hub: No</span>
            </li>
          </ul>

          <Link
            href="/get-started"
            className="block text-center border border-gray-300 rounded-md py-3 px-4 font-medium hover:bg-gray-50 transition-colors"
          >
            GET STARTED <ArrowRight className="inline-block ml-2 h-4 w-4" />
          </Link>
        </div>

        {/* Advance Plan */}
        <div className="border border-gray-200 rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-center mb-2">Advance Plan</h2>
          <p className="text-gray-500 text-center mb-6">
            Limited to paid subscription plan
          </p>

          <div className="bg-gradient-to-r from-green-500 to-green-500 text-white text-center py-4 rounded-md mb-8">
            <span className="text-3xl font-bold">$52.00</span>
            <span className="text-xl">/month</span>
          </div>

          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Cost: $52.00 per month</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Add Team Members: Yes</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Validity: Limited to paid subscription</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Add Service Max: Unlimited</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Grant permission Access: Yes</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Add Product Max: Unlimited</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Transaction percentage: 5%</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Shared Calendar: Yes</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Highlight offering Max 5</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Task Hub: Yes</span>
            </li>
          </ul>

          <Link
            href="/get-started"
            className="block text-center border border-gray-300 rounded-md py-3 px-4 font-medium hover:bg-gray-50 transition-colors"
          >
            GET STARTED <ArrowRight className="inline-block ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
