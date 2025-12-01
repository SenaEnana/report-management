import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { downloadTopMerchantApi, fetchMerchantsApi } from "@/services/MerchantService";
import { Button } from "@/components/ui/button"
import { Download } from 'lucide-react'
import { Input } from "./ui/input";
import DropdownField from "./common/form/DropdownField";
import { FormField, FormItem, FormLabel } from "./ui/form";
import { useForm, FormProvider } from "react-hook-form";

function DashboardContent() {
  const [merchants, setMerchants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    const loadMerchants = async () => {
      try {
        const { data } = await fetchMerchantsApi(0, 10, ""); //
        setMerchants(data);
         const url = localStorage.getItem("TopTransactionMerchantUrl");
          if (url) setReportUrl(url);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadMerchants();
  }, []);

  const features = [
    { title: "Districts", value: 10 },  
    { title: "Our Branches", value: 400 },
    { title: "ATM Machines", value: 352 },
    { title: "POS Machines", value: 500 },
  ];

    const methods = useForm({
      defaultValues: {
        startDate: "",
        endDate: "",
        filterType: "",
      },
    });

    const handleDownload = () => {
      if (!startDate || !endDate || !filterType) {
        alert("Please select start date, end date and filter type.");
        return;
      }

      let url = "";

      if (filterType === "txnAmount") {
        url = `http://172.24.111.254:5000/api/export/top-merchants-amount?startDate=${startDate}&endDate=${endDate}`;
      } else {
        url = `http://172.24.111.254:5000/api/export/top-merchants-txn?startDate=${startDate}&endDate=${endDate}`;
      }

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `top_merchants_${filterType}_${startDate}_to_${endDate}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

  if (!reportUrl) {
    return <p>No data available.</p>;
  }
  return (
    <main className="flex-1 flex flex-col p-6 space-y-10">
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            className="bg-gradient-to-br from-gray-50 to-white shadow-lg rounded-xl p-6 text-center border border-gray-100"
          >
            <h3 className="text-4xl font-bold text-amber-700 mb-2">
              <CountUp end={item.value} duration={2.5} separator="," />
              <span className="text-xl text-gray-500 font-medium">+</span>
            </h3>
            <p className="text-gray-700 font-semibold">{item.title}</p>
          </motion.div>
        ))}
      </section>

      <Card className="p-2">
        <div className="relative overflow-x-auto">
          <CardHeader>
            <CardTitle className="text-center text-xl font-bold">
              Top Ten Transaction Merchants
            </CardTitle>
          </CardHeader>
          <FormProvider {...methods}>
          <div className="flex items-center gap-2 rounded-lg">
            <FormField
              name="startDate"
              render={() => (
                <FormItem className="flex-1">
                  <FormLabel>Start Date</FormLabel>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </FormItem>
              )}
            />
            <FormField
              name="endDate"
              render={() => (
                <FormItem className="flex-1">
                  <FormLabel>End Date</FormLabel>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </FormItem>
              )}
            />
            <DropdownField
              name="filterType"
              label="Filter By"
              value={filterType}
              onChange={(value) => setFilterType(value)}
              options={[
                { id: "txnAmount", name: "Transaction Amount" },
                { id: "txnNumber", name: "Transaction Number" }
              ]}
            />
            <Button className="bg-amber-500" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" /> Download by Filter
            </Button>
          </div>
        </FormProvider>
            <Button className="bg-amber-500 float-end m-2"
            onClick={() => { downloadTopMerchantApi()
            }}
          >
            <Download className="mr-2 h-4 w-4" /> Download
          </Button>
          {loading ? (
            <p className="text-center py-4 text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-center py-4 text-red-500">{error}</p>
          ) : (
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-6">
                    Terminal ID
                  </th>
                  <th scope="col" className="px-6 py-6">
                    Merchant Name
                  </th>
                  <th scope="col" className="px-6 py-6">
                    Branch
                  </th>
                  <th scope="col" className="px-6 py-6">
                    District
                  </th>
                  <th scope="col" className="px-6 py-6">
                    Grand Total
                  </th>                  
                </tr>
              </thead>
              <tbody>
                {merchants.map((m, i) => (
                  <tr
                    key={i}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                  >
                    <th
                      scope="row"
                      className="px-6 py-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {m.terminal_id || "-"}
                    </th>
                    <td className="px-6 py-6">{m.merchant_name || "-"}</td>
                    <td className="px-6 py-6">{m.branch || "-"}</td>
                    <td className="px-6 py-6">{m.district || "-"}</td>
                   <td className="px-6 py-6">{m.grand_total || "-"}</td>                   
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </main>
  );
}

export default DashboardContent;