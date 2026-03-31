import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Eye,
  Loader2,
  Lock,
  LogOut,
  MessageSquare,
  Star,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { backendInterface as FullBackend, Review } from "./backend.d";
import { useActor } from "./hooks/useActor";

export default function Dashboard() {
  const { actor, isFetching } = useActor();
  const fullActor = actor as unknown as FullBackend | null;
  const [pin, setPin] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [currentPin, setCurrentPin] = useState("");

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Visit stats state
  const [totalVisits, setTotalVisits] = useState<bigint>(0n);
  const [dailyVisits, setDailyVisits] = useState<[string, bigint][]>([]);
  const [statsLoading, setStatsLoading] = useState(false);

  // Change PIN state
  const [oldPinInput, setOldPinInput] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinChangeMsg, setPinChangeMsg] = useState("");
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);
  const [pinChanging, setPinChanging] = useState(false);

  const loadReviews = useCallback(async () => {
    if (!fullActor) return;
    setReviewsLoading(true);
    try {
      const data = await fullActor!.getReviews();
      setReviews(data);
    } finally {
      setReviewsLoading(false);
    }
  }, [fullActor]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: fullActor wraps actor
  const loadStats = useCallback(async () => {
    if (!fullActor) return;
    setStatsLoading(true);
    try {
      const [total, daily] = await Promise.all([
        fullActor!.getTotalVisits(),
        fullActor!.getDailyVisits(),
      ]);
      setTotalVisits(total);
      const sorted = [...daily].sort((a, b) => b[0].localeCompare(a[0]));
      setDailyVisits(sorted);
    } finally {
      setStatsLoading(false);
    }
  }, [fullActor]);

  useEffect(() => {
    if (isLoggedIn && fullActor) {
      loadReviews();
      loadStats();
    }
  }, [isLoggedIn, fullActor, loadReviews, loadStats]);

  async function handleLogin() {
    if (!fullActor) return;
    setLoginLoading(true);
    setLoginError("");
    try {
      const ok = await fullActor!.verifyAdmin(pin);
      if (ok) {
        setIsLoggedIn(true);
        setCurrentPin(pin);
        setPin("");
      } else {
        setLoginError("Incorrect PIN. Please try again.");
      }
    } catch {
      setLoginError("Error verifying PIN. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleDeleteReview(id: bigint) {
    if (!fullActor) return;
    await fullActor!.deleteReview(currentPin, id);
    await loadReviews();
  }

  async function handleChangePin() {
    if (!fullActor) return;
    setPinChangeMsg("");
    if (newPin !== confirmPin) {
      setPinChangeMsg("New PIN and confirm PIN do not match.");
      setPinChangeSuccess(false);
      return;
    }
    if (newPin.length < 4) {
      setPinChangeMsg("New PIN must be at least 4 characters.");
      setPinChangeSuccess(false);
      return;
    }
    setPinChanging(true);
    try {
      const ok = await fullActor!.setAdminPin(oldPinInput, newPin);
      if (ok) {
        setPinChangeMsg("PIN changed successfully!");
        setPinChangeSuccess(true);
        setCurrentPin(newPin);
        setOldPinInput("");
        setNewPin("");
        setConfirmPin("");
      } else {
        setPinChangeMsg("Current PIN is incorrect.");
        setPinChangeSuccess(false);
      }
    } catch {
      setPinChangeMsg("Error changing PIN.");
      setPinChangeSuccess(false);
    } finally {
      setPinChanging(false);
    }
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setCurrentPin("");
    setReviews([]);
    setTotalVisits(0n);
    setDailyVisits([]);
  }

  function renderStars(rating: bigint) {
    const n = Number(rating);
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((starNum) => (
          <Star
            key={starNum}
            className={`w-3.5 h-3.5 ${
              starNum <= n ? "fill-violet-400 text-violet-400" : "text-zinc-600"
            }`}
          />
        ))}
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
        <div className="p-4">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
            data-ocid="dashboard.link"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </a>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="w-full max-w-sm bg-zinc-900 border-zinc-800">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-violet-600/20 flex items-center justify-center">
                <Lock className="w-6 h-6 text-violet-400" />
              </div>
              <CardTitle className="text-white text-xl">
                Admin Dashboard
              </CardTitle>
              <p className="text-zinc-400 text-sm">
                Enter your PIN to continue
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="pin" className="text-zinc-300 text-sm">
                  PIN
                </Label>
                <Input
                  id="pin"
                  type="password"
                  placeholder="Enter PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-violet-500"
                  data-ocid="dashboard.input"
                />
              </div>
              {loginError && (
                <p
                  className="text-red-400 text-sm"
                  data-ocid="dashboard.error_state"
                >
                  {loginError}
                </p>
              )}
              {isFetching && (
                <p className="text-zinc-500 text-xs">
                  Connecting to backend...
                </p>
              )}
              <Button
                onClick={handleLogin}
                disabled={loginLoading || isFetching || !pin}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                data-ocid="dashboard.primary_button"
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
            data-ocid="dashboard.link"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </a>
          <span className="text-zinc-700">|</span>
          <h1 className="text-white font-semibold">Dashboard</h1>
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="text-zinc-400 hover:text-white hover:bg-zinc-800 gap-2"
          data-ocid="dashboard.button"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <Tabs defaultValue="reviews">
          <TabsList className="bg-zinc-900 border border-zinc-800 mb-6">
            <TabsTrigger
              value="reviews"
              className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-zinc-400"
              data-ocid="dashboard.tab"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Reviews
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-zinc-400"
              data-ocid="dashboard.tab"
            >
              <Eye className="w-4 h-4 mr-2" />
              Visit Stats
            </TabsTrigger>
            <TabsTrigger
              value="pin"
              className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-zinc-400"
              data-ocid="dashboard.tab"
            >
              <Lock className="w-4 h-4 mr-2" />
              Change PIN
            </TabsTrigger>
          </TabsList>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                Client Reviews
                <Badge className="ml-2 bg-violet-600/20 text-violet-400 border-violet-600/30">
                  {reviews.length}
                </Badge>
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={loadReviews}
                disabled={reviewsLoading}
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                data-ocid="dashboard.secondary_button"
              >
                {reviewsLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "Refresh"
                )}
              </Button>
            </div>
            {reviewsLoading ? (
              <div
                className="flex items-center justify-center py-16 text-zinc-500"
                data-ocid="dashboard.loading_state"
              >
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Loading reviews...
              </div>
            ) : reviews.length === 0 ? (
              <div
                className="text-center py-16 text-zinc-500"
                data-ocid="dashboard.empty_state"
              >
                No reviews yet.
              </div>
            ) : (
              <div className="grid gap-3">
                {reviews.map((r, i) => (
                  <Card
                    key={String(r.id)}
                    className="bg-zinc-900 border-zinc-800"
                    data-ocid={`reviews.item.${i + 1}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-medium text-white">
                              {r.name}
                            </span>
                            {r.role && (
                              <Badge
                                variant="outline"
                                className="text-xs border-zinc-700 text-zinc-400"
                              >
                                {r.role}
                              </Badge>
                            )}
                            {r.company && (
                              <span className="text-xs text-zinc-500">
                                {r.company}
                              </span>
                            )}
                          </div>
                          {renderStars(r.rating)}
                          <p className="text-zinc-300 text-sm mt-2 leading-relaxed">
                            {r.reviewText}
                          </p>
                          <p className="text-zinc-600 text-xs mt-2">
                            {new Date(
                              Number(r.timestamp) / 1_000_000,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteReview(r.id)}
                          className="text-red-500 hover:text-red-400 hover:bg-red-500/10 shrink-0"
                          data-ocid={`reviews.delete_button.${i + 1}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Visit Statistics</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={loadStats}
                disabled={statsLoading}
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                data-ocid="stats.secondary_button"
              >
                {statsLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "Refresh"
                )}
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6 text-center">
                  <p className="text-zinc-400 text-sm mb-1">Total Visits</p>
                  <p className="text-4xl font-bold text-violet-400">
                    {statsLoading ? (
                      <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                    ) : (
                      String(totalVisits)
                    )}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6 text-center">
                  <p className="text-zinc-400 text-sm mb-1">Days Tracked</p>
                  <p className="text-4xl font-bold text-violet-400">
                    {dailyVisits.length}
                  </p>
                </CardContent>
              </Card>
            </div>
            {dailyVisits.length > 0 && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-white">
                    Daily Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table data-ocid="stats.table">
                    <TableHeader>
                      <TableRow className="border-zinc-800 hover:bg-transparent">
                        <TableHead className="text-zinc-400">Date</TableHead>
                        <TableHead className="text-zinc-400 text-right">
                          Visits
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dailyVisits.map(([date, count], i) => (
                        <TableRow
                          key={date}
                          className="border-zinc-800 hover:bg-zinc-800/50"
                          data-ocid={`stats.row.${i + 1}`}
                        >
                          <TableCell className="text-zinc-300">
                            {date}
                          </TableCell>
                          <TableCell className="text-right text-violet-400 font-medium">
                            {String(count)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
            {!statsLoading && dailyVisits.length === 0 && (
              <div
                className="text-center py-12 text-zinc-500"
                data-ocid="stats.empty_state"
              >
                No visit data yet.
              </div>
            )}
          </TabsContent>

          {/* Change PIN Tab */}
          <TabsContent value="pin">
            <div className="max-w-md">
              <h2 className="text-lg font-semibold mb-4">Change PIN</h2>
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-zinc-300 text-sm">Current PIN</Label>
                    <Input
                      type="password"
                      placeholder="Current PIN"
                      value={oldPinInput}
                      onChange={(e) => setOldPinInput(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-violet-500"
                      data-ocid="pin.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-zinc-300 text-sm">New PIN</Label>
                    <Input
                      type="password"
                      placeholder="New PIN"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-violet-500"
                      data-ocid="pin.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-zinc-300 text-sm">
                      Confirm New PIN
                    </Label>
                    <Input
                      type="password"
                      placeholder="Confirm new PIN"
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-violet-500"
                      data-ocid="pin.input"
                    />
                  </div>
                  {pinChangeMsg && (
                    <p
                      className={`text-sm ${pinChangeSuccess ? "text-green-400" : "text-red-400"}`}
                      data-ocid={
                        pinChangeSuccess
                          ? "pin.success_state"
                          : "pin.error_state"
                      }
                    >
                      {pinChangeMsg}
                    </p>
                  )}
                  <Button
                    onClick={handleChangePin}
                    disabled={
                      pinChanging || !oldPinInput || !newPin || !confirmPin
                    }
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                    data-ocid="pin.submit_button"
                  >
                    {pinChanging ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Changing...
                      </>
                    ) : (
                      "Update PIN"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
