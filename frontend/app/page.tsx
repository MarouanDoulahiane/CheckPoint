"use client";

import { useState } from "react";
import Navbar from "./components/navbar";

export default function Home() {
	const [file, setFile] = useState<File | null>(null);
	const [groqResponse, setGroqResponse] = useState<any>(null); // Use 'any' or a specific type

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!file) {
			alert("Please upload a file");
			return;
		}

		setGroqResponse(null); // Reset state before fetching

		const formData = new FormData();
		formData.append("file", file);

		try {
			const response = await fetch(`${process.env.BACKEND_URL || "http://localhost:3001"}/api/upload`, {
				method: "POST",
				body: formData,
			});

			if (response.ok) {
				const data = await response.json();
				setGroqResponse(data.groqResponse ?? null); // Ensure consistent state
			} else {
				alert("Error uploading file, reason: " + response.statusText);
			}
		} catch (error) {
			alert("Error uploading file, please try again!, reason: " + (error as Error).message);
		}
	};


  const downloadJSON = () => {
    if (!groqResponse) return;
    const jsonString = JSON.stringify(groqResponse, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume_summary.json";
    a.click();
  };

  const parseValue = (value: any): string | JSX.Element => {
    if (typeof value === 'string') {
        return value;
    } else if (typeof value === 'object' && value !== null) {
        return (
            <div className="flex flex-col">
                {Object.entries(value).map(([subKey, subValue]) => (
                    <div key={subKey} className="flex justify-between">
                        <span className="font-medium">{subKey}:</span>
                        <span>{parseValue(subValue as string)}</span>
                    </div>
                ))}
            </div>
        );
    }
    return String(value); // Fallback to stringify non-string, non-object values
};


	return (
		<>
			<Navbar />
			<div className="container mx-auto max-w-screen-md ">
				<h1 className="text-2xl font-bold mb-4">Upload your resume</h1>
				<p className="text-gray-500 mb-4">
					Upload your resume and get a summary of your skills and experiences.
				</p>
				<form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
					<input
						type="file"
						accept=".pdf, .docx"
						className="w-full p-2 border border-gray-300 rounded-md"
						onChange={(e) => setFile(e.target.files?.[0] || null)}
					/>
					<button
						type="submit"
						className="bg-blue-500 text-white p-2 rounded-md"
					>
						Upload
					</button>
				</form>
				{groqResponse && (
					<div className="flex flex-col gap-2 mt-4 bg-gray-100 p-4 rounded-md">
						{Object.entries(groqResponse).map(([key, value]: [string, any]	) => (
							<div key={key} className="grid grid-cols-2 gap-2 border-b border-gray-200 pb-2">
								<label className="font-bold">{key}</label>
								<div className="text-gray-700">
									{Array.isArray(value) ? (
										<ul className="list-disc list-inside">
											{value.map((item, index) => (
												<li key={index}>{parseValue(item)}</li>
											))}
										</ul>
									) : (
										// Render objects as key-value pairs
										typeof value === 'object' && value !== null ? (
											<div className="flex flex-col">
												{Object.entries(value).map(([subKey, subValue]) => (
													<div key={subKey} className="flex justify-between">
														<span className="font-medium">{subKey}:</span>
														<span>{parseValue(subValue as string)}</span>
													</div>
												))}
											</div>
										) : (
											<span>{parseValue(value as string)}</span>
										)
									)}
								</div>
							</div>
						))}
					</div>
				)}
				{/* TODO: Add a button to download the JSON response */}
				{
				groqResponse && (
					<button className="bg-blue-500 text-white p-2 rounded-md m-4" onClick={() => downloadJSON()}>Download JSON</button>
				)
				}
			</div>
		</>
	);
}
