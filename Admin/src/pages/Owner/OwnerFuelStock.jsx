import React, { useEffect, useState } from "react";
import API from "../../services/api";

const OwnerFuelStock = () => {
  const [fuelStock, setFuelStock] = useState({ benzene: 0, diesel: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("adminToken");
  const stationIds = JSON.parse(localStorage.getItem("stationIds") || "[]");

  useEffect(() => {
    const fetchFuelStock = async () => {
      try {
        if (!token) {
          setError("No token found. Please log in again.");
          setLoading(false);
          return;
        }

        if (!stationIds || stationIds.length === 0) {
          setError("No station IDs found for this owner.");
          setLoading(false);
          return;
        }

        const query = stationIds.map((id) => `stationIds=${id}`).join("&");

        const res = await API.get(`/owners/stock?${query}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFuelStock(res.data || { benzene: 0, diesel: 0 });
      } catch (err) {
        console.error("Error fetching owner fuel stock:", err);
        setError(err.response?.data?.msg || "Failed to load fuel stock data");
      } finally {
        setLoading(false);
      }
    };

    fetchFuelStock();
  }, [token]);

  if (loading) return (
    <div className="flex justify-center items-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading fuel stock...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg m-4">
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {error}
      </div>
    </div>
  );

  // Safely handle values
  const benzene = fuelStock?.benzene ?? 0;
  const diesel = fuelStock?.diesel ?? 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Fuel Stock Overview</h1>
        <p className="text-muted-foreground">Monitor current fuel stock levels across your stations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Benzene Card */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-8 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Benzene</h2>
              <p className="text-muted-foreground">Current available stock</p>
            </div>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600 mb-2">
              {benzene.toLocaleString()}
            </p>
            <p className="text-lg text-muted-foreground">Liters</p>
          </div>
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-700">Stock Level</span>
              <span className="text-blue-700 font-semibold">
                {benzene > 10000 ? "High" : benzene > 5000 ? "Medium" : "Low"}
              </span>
            </div>
          </div>
        </div>

        {/* Diesel Card */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-8 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Diesel</h2>
              <p className="text-muted-foreground">Current available stock</p>
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-green-600 mb-2">
              {diesel.toLocaleString()}
            </p>
            <p className="text-lg text-muted-foreground">Liters</p>
          </div>
          <div className="mt-6 bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-700">Stock Level</span>
              <span className="text-green-700 font-semibold">
                {diesel > 10000 ? "High" : diesel > 5000 ? "Medium" : "Low"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-card rounded-xl shadow-sm border border-border p-6 max-w-4xl mx-auto">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Stock Monitoring</h3>
          <p className="text-muted-foreground">
            Regularly monitor your fuel stock levels to ensure optimal station operations 
            and plan for timely fuel replenishment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OwnerFuelStock;
