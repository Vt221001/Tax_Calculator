import { useState, useCallback } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

const Form = () => {
  const { register, handleSubmit } = useForm();
  const [taxData, setTaxData] = useState(null);
  const [history, setHistory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onSubmit = async (data) => {
    const payload = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, Number(value)])
    );

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/tax-calculate`,
        payload
      );
      setTaxData(response.data.data);
      setHistory((prev) => [...prev, response.data.data]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchHistory = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/get-all-taxes`
      );
      setHistory(response.data.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  }, []);

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h1 className="text-xl font-bold text-center">Tax Calculator</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-3 bg-white shadow-md p-4 rounded-lg"
      >
        {[
          "annualIncome",
          "investments",
          "otherDeductions",
          "incomeFromOtherSources",
        ].map((field) => (
          <input
            key={field}
            type="number"
            placeholder={field.replace(/([A-Z])/g, " $1")}
            {...register(field, { required: true, min: 0 })}
            className="border p-2 rounded"
            required
            min={0}
          />
        ))}
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded w-1/2 mr-2"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => {
              setIsModalOpen(true);
              fetchHistory();
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded w-1/2"
          >
            History
          </button>
        </div>
      </form>

      {taxData && (
        <div className="mt-4">
          <h2 className="text-lg font-bold">Tax Calculation Result</h2>
          <table className="border w-full mt-2 text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Field</th>
                <th className="border px-4 py-2">Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(taxData).map(([key, value]) => (
                <tr key={key}>
                  <td className="border px-4 py-2">
                    {key.replace(/([A-Z])/g, " $1")}
                  </td>
                  <td className="border px-4 py-2">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {taxData.suggestions?.length > 0 && (
            <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 text-sm">
              <h3 className="font-semibold">Suggestions:</h3>
              <ul className="list-disc pl-5">
                {taxData.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[600px] shadow-lg">
            <h2 className="text-lg font-bold mb-4">Tax History</h2>
            {history.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="border w-full text-sm">
                  <thead>
                    <tr className="bg-gray-200">
                      {[
                        "Annual Income",
                        "Investments",
                        "Other Deductions",
                        "Income from Other Sources",
                        "Tax Payable",
                      ].map((heading) => (
                        <th key={heading} className="border px-3 py-2">
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((entry, index) => (
                      <tr key={index}>
                        {[
                          "annualIncome",
                          "investments",
                          "otherDeductions",
                          "incomeFromOtherSources",
                          "taxPayable",
                        ].map((field) => (
                          <td key={field} className="border px-3 py-2">
                            {entry[field]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No history available</p>
            )}
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;
