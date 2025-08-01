import { useState } from "react";
import { Calculator, DollarSign, Clock, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

export const SavingsCalculator = () => {
  const [hourlyRate, setHourlyRate] = useState(400);
  const [documentsPerMonth, setDocumentsPerMonth] = useState(20);
  const [hoursPerDocument, setHoursPerDocument] = useState(2);

  const currentMonthlyCost = hourlyRate * documentsPerMonth * hoursPerDocument;
  const newMonthlyCost = hourlyRate * documentsPerMonth * 0.25; // 15 minutes per document
  const monthlySavings = currentMonthlyCost - newMonthlyCost;
  const annualSavings = monthlySavings * 12;
  const timeSaved = documentsPerMonth * (hoursPerDocument - 0.25);

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <Calculator className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Legal Savings Calculator</h3>
          <p className="text-sm text-gray-600">Calculate your potential ROI with DocBriefly AI</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="hourlyRate" className="text-sm font-medium text-gray-700">
              Your Hourly Rate ($)
            </Label>
            <Input
              id="hourlyRate"
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Documents per Month: {documentsPerMonth}
            </Label>
            <Slider
              value={[documentsPerMonth]}
              onValueChange={(value) => setDocumentsPerMonth(value[0])}
              max={100}
              min={1}
              step={1}
              className="mt-2"
            />
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Hours per Document: {hoursPerDocument}
            </Label>
            <Slider
              value={[hoursPerDocument]}
              onValueChange={(value) => setHoursPerDocument(value[0])}
              max={8}
              min={0.5}
              step={0.5}
              className="mt-2"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-gray-900">Monthly Savings</span>
            </div>
            <p className="text-2xl font-bold text-green-600">${monthlySavings.toLocaleString()}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-gray-900">Annual Savings</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">${annualSavings.toLocaleString()}</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <span className="font-semibold text-gray-900">Time Saved/Month</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">{timeSaved.toFixed(1)} hours</p>
          </div>
        </div>
      </div>
    </Card>
  );
};