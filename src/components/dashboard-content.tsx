import { motion } from "framer-motion";
import CountUp from "react-countup";

function DashboardContent() {
  // const stats = [
  //   { title: "Total Transactions", value: 1234245 },
  //   { title: "Approved Transactions", value: 912430 },
  //   { title: "Declined Transactions", value: 311815 },
  // ];

  const features = [
    { title: "Our Branches", value: 438 },
    { title: "ATM Machines", value: 352 },
    { title: "POS Machines", value: 133 },
    { title: "Employees", value: 7000 },
  ];

  return (
    <main className="flex-1 flex flex-col p-6 space-y-10">
      {/* Top Stats Section */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="bg-white shadow-md p-6 rounded-xl border border-gray-100"
          >
            <h3 className="text-gray-600 font-medium">{item.title}</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              <CountUp
                end={item.value}
                duration={2}
                separator=","
                enableScrollSpy
              />
            </p>
          </motion.div>
        ))}
      </div> */}

      {/* Feature Counters Section */}
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
    {/* <section className="mt-10"> */}
<div className="relative overflow-x-auto bg-amber-200">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-6">
                    Product name
                </th>
                <th scope="col" className="px-6 py-6">
                    Color
                </th>
                <th scope="col" className="px-6 py-6">
                    Category
                </th>
                <th scope="col" className="px-6 py-6">
                    Price
                </th>
            </tr>
        </thead>
        <tbody>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                <th scope="row" className="px-6 py-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Apple MacBook Pro 17"
                </th>
                <td className="px-6 py-6">
                    Silver
                </td>
                <td className="px-6 py-6">
                    Laptop
                </td>
                <td className="px-6 py-6">
                    $2999
                </td>
            </tr>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                <th scope="row" className="px-6 py-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Microsoft Surface Pro
                </th>
                <td className="px-6 py-6">
                    White
                </td>
                <td className="px-6 py-6">
                    Laptop PC
                </td>
                <td className="px-6 py-6">
                    $1999
                </td>
            </tr>
            <tr className="bg-white dark:bg-gray-800">
                <th scope="row" className="px-6 py-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Magic Mouse 2
                </th>
                <td className="px-6 py-6">
                    Black
                </td>
                <td className="px-6 py-6">
                    Accessories
                </td>
                <td className="px-6 py-6">
                    $99
                </td>
            </tr>
        </tbody>
    </table>
</div>
{/* 
      </section> */}
    </main>
  );
}

export default DashboardContent;
