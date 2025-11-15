'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { ArrowLeft, Package, TrendingUp, DollarSign, Leaf } from 'lucide-react';
import { subscribeToFarmerWasteBatches } from '@/lib/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { WasteBatch } from '@/lib/types';

export default function HistoryPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [batches, setBatches] = useState<WasteBatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/login?type=farmer');
      return;
    }

    // Subscribe to real-time updates
    const unsubscribe = subscribeToFarmerWasteBatches(user.uid, (data) => {
      setBatches(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, authLoading, router]);

  const handleBack = () => {
    router.back();
  };

  // Calculate summary statistics
  const totalWaste = batches.reduce((sum, b) => sum + (b.quantityKg || 0), 0);
  const totalEarnings = batches.reduce((sum, b) => sum + (b.estimatedValue || 0), 0);
  const totalCO2Saved = batches.reduce((sum, b) => sum + (b.co2SavedTons || 0), 0);
  const matchedCount = batches.filter((b) => b.status === 'matched').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'matched':
        return 'bg-green-100 text-green-700 border-green-500';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-500';
      case 'collected':
        return 'bg-blue-100 text-blue-700 border-blue-500';
      case 'delivered':
        return 'bg-purple-100 text-purple-700 border-purple-500';
      case 'match_failed':
        return 'bg-red-100 text-red-700 border-red-500';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'matched':
        return 'Matched';
      case 'pending':
        return 'Pending Match';
      case 'collected':
        return 'Collected';
      case 'delivered':
        return 'Delivered';
      case 'match_failed':
        return 'Match Failed';
      default:
        return status;
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xl font-mukta text-brown">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream relative overflow-hidden pb-20">
      {/* Decorative Ellipses */}
      <div className="absolute top-[200px] right-[-200px] w-[400px] h-[400px] bg-gradient-to-tl from-green/15 to-yellow/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[100px] left-[-150px] w-[300px] h-[300px] bg-gradient-to-br from-purple/20 to-teal/15 rounded-full blur-3xl" />

      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-20 w-[41px] h-[41px] rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm active:scale-95 transition-all"
      >
        <ArrowLeft className="w-5 h-5 text-brown" />
      </button>

      {/* Content */}
      <div className="relative z-10 pt-20 px-6">
        {/* Title Banner */}
        <div className="mb-8 bg-yellow rounded-[36px] border-2 border-black shadow-card py-4 flex items-center justify-center">
          <h1 className="text-2xl font-mukta font-extrabold text-brown">
            My Waste History
          </h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl border-2 border-black shadow-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-brown" />
              <p className="text-sm font-mukta text-brown/70">Total Waste</p>
            </div>
            <p className="text-2xl font-mukta font-bold text-brown">
              {(totalWaste / 1000).toFixed(1)} tons
            </p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-black shadow-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green" />
              <p className="text-sm font-mukta text-brown/70">Matched</p>
            </div>
            <p className="text-2xl font-mukta font-bold text-green">
              {matchedCount} / {batches.length}
            </p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-black shadow-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-yellow-600" />
              <p className="text-sm font-mukta text-brown/70">Earnings</p>
            </div>
            <p className="text-2xl font-mukta font-bold text-yellow-600">
              ₹{totalEarnings.toFixed(0)}
            </p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-black shadow-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="w-5 h-5 text-green" />
              <p className="text-sm font-mukta text-brown/70">CO₂ Saved</p>
            </div>
            <p className="text-2xl font-mukta font-bold text-green">
              {totalCO2Saved.toFixed(1)} t
            </p>
          </div>
        </div>

        {/* Waste Batches List */}
        <div className="space-y-4">
          <h2 className="text-xl font-mukta font-bold text-brown mb-4">
            Recent Submissions
          </h2>

          {batches.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-black shadow-card p-8 text-center">
              <Package className="w-16 h-16 text-brown/30 mx-auto mb-4" />
              <p className="text-lg font-mukta text-brown/60">
                No waste submissions yet
              </p>
              <p className="text-sm font-mukta text-brown/40 mt-2">
                Submit your first waste batch to get started!
              </p>
              <button
                onClick={() => router.push('/pickup')}
                className="mt-6 bg-green text-white px-6 py-3 rounded-pill border-2 border-black shadow-card font-mukta font-bold hover:bg-green/90 active:scale-95 transition-all"
              >
                Submit Waste
              </button>
            </div>
          ) : (
            batches.map((batch) => (
              <div
                key={batch.id}
                className="bg-white rounded-2xl border-2 border-black shadow-card overflow-hidden"
              >
                {/* Header */}
                <div className="p-4 border-b-2 border-black bg-cream-light">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-mukta font-bold text-brown">
                        {batch.wasteType}
                      </h3>
                      <p className="text-sm font-mukta text-brown/60">
                        {formatDate(batch.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-mukta font-bold border-2 ${getStatusColor(
                        batch.status
                      )}`}
                    >
                      {getStatusText(batch.status)}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs font-mukta text-brown/60">Quantity</p>
                      <p className="text-lg font-mukta font-bold text-brown">
                        {batch.quantityKg} kg
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-mukta text-brown/60">Season</p>
                      <p className="text-lg font-mukta font-bold text-brown">
                        {batch.season || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Matched Industry Info */}
                  {batch.status === 'matched' && batch.matchedIndustry && (
                    <div className="mt-4 p-3 bg-green-50 border-2 border-green-500 rounded-xl">
                      <p className="text-sm font-mukta font-bold text-green-700 mb-2">
                        🤖 AI Matched With
                      </p>
                      <p className="text-lg font-mukta font-bold text-green-800">
                        {batch.matchedIndustry}
                      </p>

                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div>
                          <p className="text-xs font-mukta text-green-600">
                            Estimated Value
                          </p>
                          <p className="text-lg font-mukta font-bold text-green-800">
                            ₹{(batch.estimatedValue || 0).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-mukta text-green-600">
                            CO₂ Saved
                          </p>
                          <p className="text-lg font-mukta font-bold text-green-800">
                            {(batch.co2SavedTons || 0).toFixed(2)} tons
                          </p>
                        </div>
                      </div>

                      {batch.pm25PreventedKg && (
                        <p className="text-xs font-mukta text-green-600 mt-2">
                          PM2.5 Prevented: {batch.pm25PreventedKg.toFixed(2)} kg
                        </p>
                      )}
                    </div>
                  )}

                  {/* Failed Match Info */}
                  {batch.status === 'match_failed' && (
                    <div className="mt-4 p-3 bg-red-50 border-2 border-red-500 rounded-xl">
                      <p className="text-sm font-mukta font-bold text-red-700">
                        ⚠ Match Failed
                      </p>
                      <p className="text-xs font-mukta text-red-600 mt-1">
                        {batch.error || 'No suitable industry found. Please try again later.'}
                      </p>
                    </div>
                  )}

                  {/* Pending Match Info */}
                  {batch.status === 'pending' && (
                    <div className="mt-4 p-3 bg-yellow-50 border-2 border-yellow-500 rounded-xl">
                      <p className="text-sm font-mukta font-bold text-yellow-700">
                        ⏳ AI is finding the best match...
                      </p>
                      <p className="text-xs font-mukta text-yellow-600 mt-1">
                        Our AI agent is analyzing industries in Punjab
                      </p>
                    </div>
                  )}

                  {/* Waste Photo */}
                  {batch.photoUrl && (
                    <div className="mt-4">
                      <p className="text-xs font-mukta text-brown/60 mb-2">
                        Waste Photo
                      </p>
                      <img
                        src={batch.photoUrl}
                        alt={batch.wasteType}
                        className="w-full rounded-xl border-2 border-black"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';
