'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2, IndianRupee, User, Calendar, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { getPaymentRequests, approvePayment, rejectPayment } from '@/lib/actions/admin';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PaymentRequest {
  id: string;
  user_id: string;
  plan_id: string;
  transaction_id: string;
  amount: number;
  status: string;
  created_at: string;
  users: {
    first_name: string;
    last_name: string;
    email: string;
  };
  SubscriptionPlan: {
    name: string;
  };
}

export default function PaymentsClient() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const result = await getPaymentRequests();
      if (result.error) {
        toast.error(result.error);
      } else {
        setRequests(result.data || []);
      }
    } catch (error) {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      const result = await approvePayment(id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Payment approved and user upgraded!');
        fetchPayments();
      }
    } catch (error) {
      toast.error('Error approving payment');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      const result = await rejectPayment(id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Payment rejected');
        fetchPayments();
      }
    } catch (error) {
      toast.error('Error rejecting payment');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading payment requests...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="max-w-7xl mx-auto space-y-8 py-12 px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Payment Verification</h1>
            <p className="text-slate-500 font-medium mt-1">Review and approve transaction UTRs</p>
          </div>
          <div className="bg-primary/10 px-4 py-2 rounded-2xl flex items-center gap-2">
            <Badge className="bg-primary text-white border-none">{requests.length}</Badge>
            <span className="text-sm font-bold text-primary">Pending Requests</span>
          </div>
        </div>

        <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
          <CardHeader className="bg-white border-b border-slate-100 p-8">
            <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-primary" />
              Pending Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                    <TableHead className="font-bold text-slate-900 py-4 pl-8">User</TableHead>
                    <TableHead className="font-bold text-slate-900 py-4">Plan Details</TableHead>
                    <TableHead className="font-bold text-slate-900 py-4">Transaction Info</TableHead>
                    <TableHead className="font-bold text-slate-900 py-4">Date</TableHead>
                    <TableHead className="font-bold text-slate-900 py-4 pr-8 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.length > 0 ? (
                    requests.map((req) => (
                      <TableRow key={req.id} className="hover:bg-slate-50/30 transition-colors border-b border-slate-50">
                        <TableCell className="py-6 pl-8">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                              <User className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{req.users.first_name} {req.users.last_name}</div>
                              <div className="text-xs text-slate-400 font-medium">{req.users.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-6">
                          <div className="flex flex-col gap-1">
                            <Badge variant="outline" className="w-fit border-primary/20 text-primary bg-primary/5 font-bold">
                              {req.SubscriptionPlan.name}
                            </Badge>
                            <div className="flex items-center text-sm font-black text-slate-700">
                              <IndianRupee className="w-3 h-3" />
                              {req.amount}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-6">
                          <div className="flex flex-col gap-1">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">UTR / Transaction ID</div>
                            <div className="font-mono text-sm bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 w-fit">
                              {req.transaction_id}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-6">
                          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(req.created_at), 'MMM dd, yyyy')}
                          </div>
                        </TableCell>
                        <TableCell className="py-6 pr-8 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-2 border-rose-100 text-rose-500 hover:bg-rose-50 hover:border-rose-200 font-bold rounded-xl transition-all active:scale-95"
                                  disabled={!!processingId}
                                >
                                  {processingId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
                                  Reject
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="rounded-3xl border-none">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-2xl font-black">Reject Payment?</AlertDialogTitle>
                                  <AlertDialogDescription className="text-slate-500 font-medium">
                                    Are you sure you want to reject this payment request? The user will not 
                                    be granted premium access.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="gap-2">
                                  <AlertDialogCancel className="rounded-xl font-bold border-slate-200">Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleReject(req.id)}
                                    className="rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white"
                                  >
                                    Confirm Reject
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
                                  disabled={!!processingId}
                                >
                                  {processingId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                                  Approve
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="rounded-3xl border-none">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-2xl font-black">Approve Payment?</AlertDialogTitle>
                                  <AlertDialogDescription className="text-slate-500 font-medium">
                                    This will verify the transaction and grant **Premium Access** to 
                                    {req.users.first_name} {req.users.last_name}.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="gap-2">
                                  <AlertDialogCancel className="rounded-xl font-bold border-slate-200">Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleApprove(req.id)}
                                    className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-white"
                                  >
                                    Confirm Approval
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-32">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                            <CreditCard className="w-10 h-10 text-slate-200" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-slate-900 font-black text-xl">All caught up!</p>
                            <p className="text-slate-400 font-medium">No pending payment requests found.</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
