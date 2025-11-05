import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { downloadTopMerchantApi, fetchMerchantsApi } from "@/services/MerchantService";
import { Button } from "@/components/ui/button"
import { Download } from 'lucide-react'

function DashboardContent() {
  const [merchants, setMerchants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportUrl, setReportUrl] = useState<string | null>(null);

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