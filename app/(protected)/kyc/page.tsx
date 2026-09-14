"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ThemeToggle from "@/components/ui/theme-toggle";
import {
  Upload,
  X,
  Shield,
  Lock,
  CheckCircle2,
  FileCheck,
  Loader2,
  Check,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import useSWR from "swr";
import { apiFetch } from "@/lib/api";
import { PROFILE_KEY } from "@/lib/swrKeys";
import { toast } from "sonner";

const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "your-cloud-name";
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "elite_preset";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const kycSchema = z.object({
  title: z.enum(["mr", "mrs", "ms", "dr", "prof"], {
    message: "Please select a title",
  }),
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  dob: z.string().min(1, "Date of birth is required"),
  currency: z.string().min(1, "Currency is required"),
  status_of_employment: z.enum(["employed", "self_employed", "unemployed", "student", "retired"], {
    message: "Please select employment status",
  }),
  source_of_income: z.enum(["salary", "business", "investments", "pension", "savings", "inheritance", "other"], {
    message: "Please select source of income",
  }),
  industry: z.string().min(1, "Please select an industry"),
  
  annual_amount: z.enum(["0-15k", "15k-50k", "50k-200k", "200k-500k", "500k-1m", "1m-3m", "3m+"], {
    message: "Please select annual income range",
  }),
  estimated_net_worth: z.enum(["0-50k", "50k-100k", "100k-500k", "500k-1m", "1m-5m", "5m+"], {
    message: "Please select net worth range",
  }),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  region: z.string().min(2, "Province/State is required"),
  postal_code: z.string().min(3, "Postal code is required"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .refine((phone) => {
      const digitsOnly = phone.replace(/[\s\+\-\(\)]/g, "");
      return digitsOnly.length >= 10;
    }, "Please enter a complete phone number"),
  id_type: z.enum(["passport", "driver_license", "national_id", "voter_card"], {
    message: "Please select an ID type",
  }),
});

type KYCFormData = z.infer<typeof kycSchema>;

const stages = [
  { title: "Personal Information", description: "Your basic personal details" },
  { title: "Financial Information", description: "Your financial details and preferences" },
  { title: "Address Information", description: "Your residential address" },
  { title: "Identity Verification", description: "Upload your identification documents" },
];

export default function KYCVerificationPage() {
  const [currentStage, setCurrentStage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [idFrontUrl, setIdFrontUrl] = useState<string | null>(null);
  const [idBackUrl, setIdBackUrl] = useState<string | null>(null);
  const [idFrontPreview, setIdFrontPreview] = useState<string | null>(null);
  const [idBackPreview, setIdBackPreview] = useState<string | null>(null);
  const [countryCallingCode, setCountryCallingCode] = useState<string>("");

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    trigger,
  } = useForm<KYCFormData>({
    resolver: zodResolver(kycSchema),
    mode: "onChange",
  });

  useEffect(() => setMounted(true), []);

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) return `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`;
    if (!ALLOWED_FILE_TYPES.includes(file.type)) return "Only JPEG, PNG, and WebP images are allowed";
    return null;
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    data.append("folder", "kyc_documents");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: data }
    );

    if (!response.ok) throw new Error("Failed to upload image to Cloudinary");
    const result = await response.json();
    return result.secure_url;
  };

  const onDropFront = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    const validationError = validateFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setUploadingFront(true);
    try {
      setIdFrontPreview(URL.createObjectURL(file));
      const url = await uploadToCloudinary(file);
      setIdFrontUrl(url);
      toast.success("Front ID uploaded successfully");
    } catch {
      toast.error("Failed to upload front ID");
      setIdFrontPreview(null);
      setIdFrontUrl(null);
    } finally {
      setUploadingFront(false);
    }
  }, []);

  const { getRootProps: getRootPropsFront, getInputProps: getInputPropsFront, isDragActive: isDragActiveFront } = useDropzone({
    onDrop: onDropFront,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    disabled: uploadingFront,
  });

  const onDropBack = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    const validationError = validateFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setUploadingBack(true);
    try {
      setIdBackPreview(URL.createObjectURL(file));
      const url = await uploadToCloudinary(file);
      setIdBackUrl(url);
      toast.success("Back ID uploaded successfully");
    } catch {
      toast.error("Failed to upload back ID");
      setIdBackPreview(null);
      setIdBackUrl(null);
    } finally {
      setUploadingBack(false);
    }
  }, []);

  const { getRootProps: getRootPropsBack, getInputProps: getInputPropsBack, isDragActive: isDragActiveBack } = useDropzone({
    onDrop: onDropBack,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    disabled: uploadingBack,
  });

  const handleNext = async () => {
    let isValid = false;

    if (currentStage === 0) {
      isValid = await trigger(["title", "first_name", "last_name", "dob"]);
    } else if (currentStage === 1) {
      isValid = await trigger(["currency", "status_of_employment", "source_of_income", "industry", "annual_amount", "estimated_net_worth"]);
    } else if (currentStage === 2) {
      isValid = await trigger(["address", "city", "region", "postal_code", "phone"]);
    }

    if (isValid) {
      setCurrentStage(currentStage + 1);
    }
  };

  const handleBack = () => {
    if (currentStage > 0) {
      setCurrentStage(currentStage - 1);
    }
  };

  const onSubmit = async (data: KYCFormData) => {
    if (!idFrontUrl || !idBackUrl) {
      toast.error("Please upload both front and back of your ID");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...data,
        id_front_url: idFrontUrl,
        id_back_url: idBackUrl,
      };

      const res = await apiFetch("/submit-kyc/", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        const errorMessage = result?.error || result?.detail || `KYC submission failed (${res.status})`;
        throw new Error(errorMessage);
      }

      toast.success("KYC submitted successfully! Redirecting...");
      setTimeout(() => router.push("/portfolio"), 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to submit KYC. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Shared key with the rest of the app — if profile is already cached
  // (e.g. navigated here from the dashboard), this resolves instantly.
  const { data: profileRaw, error: profileError } = useSWR<{ user?: Record<string, unknown> } & Record<string, unknown>>(
    mounted ? PROFILE_KEY : null
  );

  useEffect(() => {
    if (profileRaw) {
      const data = (profileRaw.user || profileRaw) as { has_submitted_kyc?: boolean; country_calling_code?: string };
      if (data.has_submitted_kyc) {
        router.push("/portfolio");
        return;
      }
      const code = data.country_calling_code || localStorage.getItem("country_calling_code") || "";
      setCountryCallingCode(code);
      if (code && !getValues("phone")) {
        setValue("phone", code);
      }
    } else if (profileError) {
      const code = localStorage.getItem("country_calling_code") || "";
      setCountryCallingCode(code);
      if (code) setValue("phone", code);
    }
  }, [profileRaw, profileError, setValue, getValues, router]);

  return (
    <div className="min-h-screen bg-transparent text-gray-900 dark:text-white transition-colors duration-300">
      {/* Banner Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-green-600 rounded-2xl overflow-hidden px-6 sm:px-10 py-8 sm:py-12 min-h-[180px] sm:min-h-[220px]"
        >
          {/* Background chart line SVG */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 800 300"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M0,250 C50,240 100,230 150,220 C200,210 250,200 300,180 C350,160 400,150 450,140 C500,130 520,125 550,110 C580,95 620,80 660,70 C700,60 740,55 800,50"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M0,270 C80,265 160,260 240,250 C320,240 380,225 440,210 C500,195 540,180 580,165 C620,150 680,130 720,115 C760,100 780,90 800,80"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                  Complete Your Profile
                </h1>
                <p className="mt-2 text-sm sm:text-base text-green-100">
                  Verify your identity to unlock all trading features
                </p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Progress Indicator */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center justify-between">
          {stages.map((stage, index) => (
            <div key={index} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <motion.div
                  initial={false}
                  animate={{
                    scale: index === currentStage ? 1.1 : 1,
                    backgroundColor: index <= currentStage ? "rgb(22, 163, 74)" : "rgb(209, 213, 219)",
                  }}
                  transition={{ duration: 0.3 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                    index <= currentStage
                      ? "bg-green-600"
                      : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {index < currentStage ? <CheckCircle2 className="w-6 h-6" /> : <span>{index + 1}</span>}
                </motion.div>
                <p className="text-xs mt-2 text-center hidden sm:block text-gray-600 dark:text-gray-400 max-w-[100px]">
                  {stage.title}
                </p>
              </div>
              {index < stages.length - 1 && (
                <div className={`h-1 flex-1 transition-all duration-500 ${
                  index < currentStage ? "bg-green-600" : "bg-gray-200 dark:bg-gray-700"
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-[#0d3320] rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-white/10 shadow-lg"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  {currentStage + 1}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stages[currentStage].title}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stages[currentStage].description}</p>
                </div>
              </div>

              {/* Stage 0: Personal Information */}
              {currentStage === 0 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <select
                      {...register("title")}
                      className="w-full border rounded-lg px-4 py-3 bg-white dark:bg-[#071a0e] border-gray-300 dark:border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-green-600"
                    >
                      <option value="">Select Title</option>
                      <option value="mr">Mr.</option>
                      <option value="mrs">Mrs.</option>
                      <option value="ms">Ms.</option>
                      <option value="dr">Dr.</option>
                      <option value="prof">Prof.</option>
                    </select>
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name</label>
                      <input
                        type="text"
                        {...register("first_name")}
                        placeholder="John"
                        className="w-full border rounded-lg px-4 py-3 bg-white dark:bg-[#071a0e] border-gray-300 dark:border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-green-600"
                      />
                      {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name</label>
                      <input
                        type="text"
                        {...register("last_name")}
                        placeholder="Doe"
                        className="w-full border rounded-lg px-4 py-3 bg-white dark:bg-[#071a0e] border-gray-300 dark:border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-green-600"
                      />
                      {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Date of Birth</label>
                    <input
                      type="date"
                      {...register("dob")}
                      className="w-full border rounded-lg px-4 py-3 bg-white dark:bg-[#071a0e] border-gray-300 dark:border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                    {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>}
                  </div>
                </div>
              )}

              {/* Stage 1: Financial Information */}
              {currentStage === 1 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">Currency</label>
                    <select
                      {...register("currency")}
                      className="w-full border rounded-lg px-4 py-3 bg-white dark:bg-[#071a0e] border-gray-300 dark:border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-green-600"
                    >
                      <option value="">Select Currency</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                      <option value="JPY">JPY - Japanese Yen</option>
                    </select>
                    {errors.currency && <p className="text-red-500 text-sm mt-1">{errors.currency.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Status of Employment</label>
                    <select
                      {...register("status_of_employment")}
                      className="w-full border rounded-lg px-4 py-3 bg-white dark:bg-[#071a0e] border-gray-300 dark:border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-green-600"
                    >
                      <option value="">Select Employment Status</option>
                      <option value="employed">Employed</option>
                      <option value="self_employed">Self-Employed</option>
                      <option value="unemployed">Unemployed</option>
                      <option value="student">Student</option>
                      <option value="retired">Retired</option>
                    </select>
                    {errors.status_of_employment && <p className="text-red-500 text-sm mt-1">{errors.status_of_employment.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Source of Income</label>
                    <select
                      {...register("source_of_income")}
                      className="w-full border rounded-lg px-4 py-3 bg-white dark:bg-[#071a0e] border-gray-300 dark:border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-green-600"
                    >
                      <option value="">Select Source of Income</option>
                      <option value="salary">Salary</option>
                      <option value="business">Business</option>
                      <option value="investments">Investments</option>
                      <option value="pension">Pension</option>
                      <option value="savings">Savings</option>
                      <option value="inheritance">Inheritance</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.source_of_income && <p className="text-red-500 text-sm mt-1">{errors.source_of_income.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Industry</label>
                    <select
                      {...register("industry")}
                      className="w-full border rounded-lg px-4 py-3 bg-white dark:bg-[#071a0e] border-gray-300 dark:border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-green-600"
                    >
                      <option value="">Select Industry</option>
                      <option value="technology">Technology</option>
                      <option value="finance">Finance</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="education">Education</option>
                      <option value="retail">Retail</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="construction">Construction</option>
                      <option value="agriculture">Agriculture</option>
                      <option value="hospitality">Hospitality</option>
                      <option value="transportation">Transportation</option>
                      <option value="real_estate">Real Estate</option>
                      <option value="legal">Legal</option>
                      <option value="media">Media & Entertainment</option>
                      <option value="government">Government</option>
                      <option value="non_profit">Non-Profit</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry.message}</p>}
                  </div>

                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Annual Amount (USD)</label>
                    <select
                      {...register("annual_amount")}
                      className="w-full border rounded-lg px-4 py-3 bg-white dark:bg-[#071a0e] border-gray-300 dark:border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-green-600"
                    >
                      <option value="">Select Annual Income Range</option>
                      <option value="0-15k">Up to $15,000</option>
                      <option value="15k-50k">$15,000 - $50,000</option>
                      <option value="50k-200k">$50,000 - $200,000</option>
                      <option value="200k-500k">$200,000 - $500,000</option>
                      <option value="500k-1m">$500,000 - $1,000,000</option>
                      <option value="1m-3m">$1,000,000 - $3,000,000</option>
                      <option value="3m+">Over $3,000,000</option>
                    </select>
                    {errors.annual_amount && <p className="text-red-500 text-sm mt-1">{errors.annual_amount.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Estimated Net Worth (USD)</label>
                    <select
                      {...register("estimated_net_worth")}
                      className="w-full border rounded-lg px-4 py-3 bg-white dark:bg-[#071a0e] border-gray-300 dark:border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-green-600"
                    >
                      <option value="">Select Net Worth Range</option>
                      <option value="0-50k">Up to $50,000</option>
                      <option value="50k-100k">$50,000 - $100,000</option>
                      <option value="100k-500k">$100,000 - $500,000</option>
                      <option value="500k-1m">$500,000 - $1,000,000</option>
                      <option value="1m-5m">$1,000,000 - $5,000,000</option>
                      <option value="5m+">Over $5,000,000</option>
                    </select>
                    {errors.estimated_net_worth && <p className="text-red-500 text-sm mt-1">{errors.estimated_net_worth.message}</p>}
                  </div>
                </div>
              )}

              {/* Stage 2: Address Information */}
              {currentStage === 2 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">Street Address</label>
                    <input
                      type="text"
                      {...register("address")}
                      placeholder="123 Main Street"
                      className="w-full border rounded-lg px-4 py-3 bg-white dark:bg-[#071a0e] border-gray-300 dark:border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">City</label>
                      <input
                        type="text"
                        {...register("city")}
                        placeholder="New York"
                        className="w-full border rounded-lg px-4 py-3 bg-white dark:bg-[#071a0e] border-gray-300 dark:border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-green-600"
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Province/State</label>
                      <input
                        type="text"
                        {...register("region")}
                        placeholder="NY"
                        className="w-full border rounded-lg px-4 py-3 bg-white dark:bg-[#071a0e] border-gray-300 dark:border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-green-600"
                      />
                      {errors.region && <p className="text-red-500 text-sm mt-1">{errors.region.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Zipcode</label>
                    <input
                      type="text"
                      {...register("postal_code")}
                      placeholder="10001"
                      className="w-full border rounded-lg px-4 py-3 bg-white dark:bg-[#071a0e] border-gray-300 dark:border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                    {errors.postal_code && <p className="text-red-500 text-sm mt-1">{errors.postal_code.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      {...register("phone")}
                      placeholder={countryCallingCode ? `${countryCallingCode} 234 567 8900` : "+1 234 567 8900"}
                      className="w-full border rounded-lg px-4 py-3 bg-white dark:bg-[#071a0e] border-gray-300 dark:border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                    {countryCallingCode && <p className="text-xs text-gray-500 mt-1">Country code {countryCallingCode} detected</p>}
                  </div>
                </div>
              )}

              {/* Stage 3: Identity Verification */}
              {currentStage === 3 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">Identification Type</label>
                    <select
                      {...register("id_type")}
                      className="w-full border rounded-lg px-4 py-3 bg-white dark:bg-[#071a0e] border-gray-300 dark:border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-green-600"
                    >
                      <option value="">Select ID Type</option>
                      <option value="passport">Passport</option>
                      <option value="driver_license">Driver&apos;s License</option>
                      <option value="national_id">National ID</option>
                      <option value="voter_card">Voter&apos;s Card</option>
                    </select>
                    {errors.id_type && <p className="text-red-500 text-sm mt-1">{errors.id_type.message}</p>}
                  </div>

                  {/* ID Front */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Front ID</label>
                    {!idFrontPreview ? (
                      <div
                        {...getRootPropsFront()}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                          isDragActiveFront ? "border-green-600 bg-green-50 dark:bg-green-900/20"
                            : uploadingFront ? "border-gray-400 bg-gray-100/50 dark:bg-gray-800/50 cursor-not-allowed"
                            : "border-gray-300 dark:border-gray-600/50 hover:border-green-500"
                        }`}
                      >
                        <input {...getInputPropsFront()} />
                        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">Drag & drop or click to upload</p>
                        <p className="text-xs text-gray-400 mt-2">Max size: 10MB</p>
                      </div>
                    ) : (
                      <div className="relative w-full h-48 group rounded-lg overflow-hidden">
                        <Image src={idFrontPreview} alt="ID Front" fill className="object-cover" />
                        {uploadingFront && (
                          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                            <Loader2 className="w-10 h-10 text-green-500 animate-spin mb-3" />
                            <p className="text-white font-medium text-sm">Uploading image...</p>
                          </div>
                        )}
                        {!uploadingFront && (
                          <button
                            type="button"
                            onClick={() => { setIdFrontUrl(null); setIdFrontPreview(null); }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        {idFrontUrl && !uploadingFront && (
                          <div className="absolute bottom-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1.5 z-20">
                            <Check className="w-3 h-3" /> Uploaded
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* ID Back */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Back ID</label>
                    {!idBackPreview ? (
                      <div
                        {...getRootPropsBack()}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                          isDragActiveBack ? "border-green-600 bg-green-50 dark:bg-green-900/20"
                            : uploadingBack ? "border-gray-400 bg-gray-100/50 dark:bg-gray-800/50 cursor-not-allowed"
                            : "border-gray-300 dark:border-gray-600/50 hover:border-green-500"
                        }`}
                      >
                        <input {...getInputPropsBack()} />
                        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">Drag & drop or click to upload</p>
                        <p className="text-xs text-gray-400 mt-2">Max size: 10MB</p>
                      </div>
                    ) : (
                      <div className="relative w-full h-48 group rounded-lg overflow-hidden">
                        <Image src={idBackPreview} alt="ID Back" fill className="object-cover" />
                        {uploadingBack && (
                          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                            <Loader2 className="w-10 h-10 text-green-500 animate-spin mb-3" />
                            <p className="text-white font-medium text-sm">Uploading image...</p>
                          </div>
                        )}
                        {!uploadingBack && (
                          <button
                            type="button"
                            onClick={() => { setIdBackUrl(null); setIdBackPreview(null); }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        {idBackUrl && !uploadingBack && (
                          <div className="absolute bottom-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1.5 z-20">
                            <Check className="w-3 h-3" /> Uploaded
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Privacy & Security Section */}
                  <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700/50 rounded-xl p-6 mt-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Privacy & Security</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-300">Your information is protected with industry-leading security measures</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-14">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-xs text-gray-700 dark:text-gray-300">SSL encryption</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-xs text-gray-700 dark:text-gray-300">Two-factor authentication</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-xs text-gray-700 dark:text-gray-300">Regular security audits</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-xs text-gray-700 dark:text-gray-300">GDPR compliant</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8">
                {currentStage > 0 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" /> Back
                  </button>
                )}
                {currentStage < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    Continue <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || uploadingFront || uploadingBack}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        Submit KYC <CheckCircle2 className="w-5 h-5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
