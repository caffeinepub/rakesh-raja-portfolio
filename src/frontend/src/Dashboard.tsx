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
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Briefcase,
  Edit2,
  Eye,
  FolderOpen,
  Loader2,
  Lock,
  LogOut,
  MessageSquare,
  Plus,
  Star,
  Trash2,
  Wrench,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type {
  Experience as BackendExperience,
  Project as BackendProject,
  backendInterface as FullBackend,
  Review,
  SkillCategory,
  VisitRecord,
} from "./backend.d";
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
  const [dailyVisits, setDailyVisits] = useState<VisitRecord[]>([]);
  const [statsLoading, setStatsLoading] = useState(false);

  // Change PIN state
  const [oldPinInput, setOldPinInput] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinChangeMsg, setPinChangeMsg] = useState("");
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);
  const [pinChanging, setPinChanging] = useState(false);

  // Experience state
  const [experiences, setExperiences] = useState<BackendExperience[]>([]);
  const [expLoading, setExpLoading] = useState(false);
  const [expShowAdd, setExpShowAdd] = useState(false);
  const [expEditId, setExpEditId] = useState<bigint | null>(null);
  const [expTitle, setExpTitle] = useState("");
  const [expCompany, setExpCompany] = useState("");
  const [expPeriod, setExpPeriod] = useState("");
  const [expDesc, setExpDesc] = useState("");
  const [expSaving, setExpSaving] = useState(false);

  // Skills state
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [skillShowAdd, setSkillShowAdd] = useState(false);
  const [skillCategory, setSkillCategory] = useState("");
  const [skillItems, setSkillItems] = useState("");
  const [skillSaving, setSkillSaving] = useState(false);

  // Projects state
  const [projects, setProjects] = useState<BackendProject[]>([]);
  const [projLoading, setProjLoading] = useState(false);
  const [projShowAdd, setProjShowAdd] = useState(false);
  const [projEditId, setProjEditId] = useState<bigint | null>(null);
  const [projTitle, setProjTitle] = useState("");
  const [projUrl, setProjUrl] = useState("");
  const [projImageUrl, setProjImageUrl] = useState("");
  const [projSortOrder, setProjSortOrder] = useState("");
  const [projSaving, setProjSaving] = useState(false);

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
      const sorted = [...daily].sort((a, b) => b.date.localeCompare(a.date));
      setDailyVisits(sorted);
    } finally {
      setStatsLoading(false);
    }
  }, [fullActor]);

  const loadExperiences = useCallback(async () => {
    if (!fullActor) return;
    setExpLoading(true);
    try {
      const data = await fullActor!.getExperiences();
      setExperiences(data);
    } finally {
      setExpLoading(false);
    }
  }, [fullActor]);

  const loadSkills = useCallback(async () => {
    if (!fullActor) return;
    setSkillsLoading(true);
    try {
      const data = await fullActor!.getSkills();
      setSkills(data);
    } finally {
      setSkillsLoading(false);
    }
  }, [fullActor]);

  const loadProjects = useCallback(async () => {
    if (!fullActor) return;
    setProjLoading(true);
    try {
      const data = await fullActor!.getProjects();
      setProjects(data);
    } finally {
      setProjLoading(false);
    }
  }, [fullActor]);

  useEffect(() => {
    if (isLoggedIn && fullActor) {
      loadReviews();
      loadStats();
      loadExperiences();
      loadSkills();
      loadProjects();
    }
  }, [
    isLoggedIn,
    fullActor,
    loadReviews,
    loadStats,
    loadExperiences,
    loadSkills,
    loadProjects,
  ]);

  async function handleLogin() {
    setLoginLoading(true);
    setLoginError("");
    try {
      let isValid = false;
      if (fullActor) {
        isValid = await fullActor.verifyAdmin(pin);
      } else {
        const storedPin = localStorage.getItem("adminPin") ?? "rakesh2025";
        isValid = pin === storedPin;
      }
      if (isValid) {
        setIsLoggedIn(true);
        setCurrentPin(pin);
        setPin("");
      } else {
        setLoginError("Incorrect PIN. Please try again.");
      }
    } catch {
      const storedPin = localStorage.getItem("adminPin") ?? "rakesh2025";
      if (pin === storedPin) {
        setIsLoggedIn(true);
        setCurrentPin(pin);
        setPin("");
      } else {
        setLoginError("Incorrect PIN. Please try again.");
      }
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
    const storedPin = localStorage.getItem("adminPin") ?? "rakesh2025";
    if (oldPinInput !== storedPin) {
      setPinChangeMsg("Current PIN is incorrect.");
      setPinChangeSuccess(false);
      return;
    }
    setPinChanging(true);
    try {
      localStorage.setItem("adminPin", newPin);
      // Also update backend if available
      if (fullActor) {
        try {
          await fullActor.setAdminPin(oldPinInput, newPin);
        } catch {
          /* ignore */
        }
      }
      setPinChangeMsg("PIN changed successfully!");
      setPinChangeSuccess(true);
      setCurrentPin(newPin);
      setOldPinInput("");
      setNewPin("");
      setConfirmPin("");
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
    setExperiences([]);
    setSkills([]);
    setProjects([]);
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

  // Experience handlers
  function startEditExp(exp: BackendExperience) {
    setExpEditId(exp.id);
    setExpTitle(exp.title);
    setExpCompany(exp.company);
    setExpPeriod(exp.period);
    setExpDesc(exp.description);
    setExpShowAdd(false);
  }

  function cancelExpForm() {
    setExpShowAdd(false);
    setExpEditId(null);
    setExpTitle("");
    setExpCompany("");
    setExpPeriod("");
    setExpDesc("");
  }

  async function handleSaveExp() {
    if (!fullActor || !expTitle || !expCompany) return;
    setExpSaving(true);
    try {
      if (expEditId !== null) {
        await fullActor!.updateExperience(
          currentPin,
          expEditId,
          expTitle,
          expCompany,
          expPeriod,
          expDesc,
          BigInt(experiences.length),
        );
      } else {
        await fullActor!.addExperience(
          currentPin,
          expTitle,
          expCompany,
          expPeriod,
          expDesc,
          BigInt(experiences.length + 1),
        );
      }
      cancelExpForm();
      await loadExperiences();
    } finally {
      setExpSaving(false);
    }
  }

  async function handleDeleteExp(id: bigint) {
    if (!fullActor) return;
    await fullActor!.deleteExperience(currentPin, id);
    await loadExperiences();
  }

  // Skills handlers
  function cancelSkillForm() {
    setSkillShowAdd(false);
    setSkillCategory("");
    setSkillItems("");
  }

  async function handleSaveSkill() {
    if (!fullActor || !skillCategory) return;
    setSkillSaving(true);
    try {
      const items = skillItems
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean);
      await fullActor!.addSkillCategory(
        currentPin,
        skillCategory,
        items,
        BigInt(skills.length + 1),
      );
      cancelSkillForm();
      await loadSkills();
    } finally {
      setSkillSaving(false);
    }
  }

  async function handleDeleteSkill(id: bigint) {
    if (!fullActor) return;
    await fullActor!.deleteSkillCategory(currentPin, id);
    await loadSkills();
  }

  // Projects handlers
  function startEditProj(p: BackendProject) {
    setProjEditId(p.id);
    setProjTitle(p.title);
    setProjUrl(p.url);
    setProjImageUrl(p.imageUrl);
    setProjSortOrder(String(p.sortOrder));
    setProjShowAdd(false);
  }

  function cancelProjForm() {
    setProjShowAdd(false);
    setProjEditId(null);
    setProjTitle("");
    setProjUrl("");
    setProjImageUrl("");
    setProjSortOrder("");
  }

  async function handleSaveProj() {
    if (!fullActor || !projTitle || !projUrl) return;
    setProjSaving(true);
    try {
      const sortOrder = BigInt(projSortOrder || projects.length + 1);
      if (projEditId !== null) {
        await fullActor!.updateProject(
          currentPin,
          projEditId,
          projTitle,
          projUrl,
          projImageUrl,
          sortOrder,
        );
      } else {
        await fullActor!.addProject(
          currentPin,
          projTitle,
          projUrl,
          projImageUrl,
          sortOrder,
        );
      }
      cancelProjForm();
      await loadProjects();
    } finally {
      setProjSaving(false);
    }
  }

  async function handleDeleteProj(id: bigint) {
    if (!fullActor) return;
    await fullActor!.deleteProject(currentPin, id);
    await loadProjects();
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
                disabled={loginLoading || !pin}
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

  const inputCls =
    "bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-violet-500";
  const labelCls = "text-zinc-300 text-sm";

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
          <TabsList className="bg-zinc-900 border border-zinc-800 mb-6 flex-wrap h-auto gap-1 p-1">
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
              value="experience"
              className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-zinc-400"
              data-ocid="dashboard.tab"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Experience
            </TabsTrigger>
            <TabsTrigger
              value="skills"
              className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-zinc-400"
              data-ocid="dashboard.tab"
            >
              <Wrench className="w-4 h-4 mr-2" />
              Skills
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-zinc-400"
              data-ocid="dashboard.tab"
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Projects
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
                      {dailyVisits.map((r, i) => (
                        <TableRow
                          key={r.date}
                          className="border-zinc-800 hover:bg-zinc-800/50"
                          data-ocid={`stats.row.${i + 1}`}
                        >
                          <TableCell className="text-zinc-300">
                            {r.date}
                          </TableCell>
                          <TableCell className="text-right text-violet-400 font-medium">
                            {String(r.count)}
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

          {/* Experience Tab */}
          <TabsContent value="experience">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                Work Experience
                <Badge className="ml-2 bg-violet-600/20 text-violet-400 border-violet-600/30">
                  {experiences.length}
                </Badge>
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadExperiences}
                  disabled={expLoading}
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  data-ocid="experience.secondary_button"
                >
                  {expLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    "Refresh"
                  )}
                </Button>
                {!expShowAdd && expEditId === null && (
                  <Button
                    size="sm"
                    onClick={() => setExpShowAdd(true)}
                    className="bg-violet-600 hover:bg-violet-700 text-white gap-1"
                    data-ocid="experience.open_modal_button"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Experience
                  </Button>
                )}
              </div>
            </div>

            {/* Add/Edit Form */}
            {(expShowAdd || expEditId !== null) && (
              <Card
                className="bg-zinc-900 border-zinc-700 mb-4"
                data-ocid="experience.panel"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-white flex items-center justify-between">
                    {expEditId !== null ? "Edit Experience" : "Add Experience"}
                    <button
                      type="button"
                      onClick={cancelExpForm}
                      className="text-zinc-500 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className={labelCls}>Title / Role *</Label>
                      <Input
                        value={expTitle}
                        onChange={(e) => setExpTitle(e.target.value)}
                        placeholder="Visual Designer"
                        className={inputCls}
                        data-ocid="experience.input"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className={labelCls}>Company *</Label>
                      <Input
                        value={expCompany}
                        onChange={(e) => setExpCompany(e.target.value)}
                        placeholder="Company Name"
                        className={inputCls}
                        data-ocid="experience.input"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className={labelCls}>Period</Label>
                    <Input
                      value={expPeriod}
                      onChange={(e) => setExpPeriod(e.target.value)}
                      placeholder="Jan 2023 – Present"
                      className={inputCls}
                      data-ocid="experience.input"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className={labelCls}>Description</Label>
                    <Textarea
                      value={expDesc}
                      onChange={(e) => setExpDesc(e.target.value)}
                      placeholder="Brief description of responsibilities..."
                      rows={3}
                      className={`${inputCls} resize-none`}
                      data-ocid="experience.textarea"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={cancelExpForm}
                      className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                      data-ocid="experience.cancel_button"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveExp}
                      disabled={expSaving || !expTitle || !expCompany}
                      className="bg-violet-600 hover:bg-violet-700 text-white"
                      data-ocid="experience.save_button"
                    >
                      {expSaving ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                      ) : null}
                      {expEditId !== null ? "Update" : "Save"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {expLoading ? (
              <div
                className="flex items-center justify-center py-12 text-zinc-500"
                data-ocid="experience.loading_state"
              >
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading...
              </div>
            ) : experiences.length === 0 ? (
              <div
                className="text-center py-12 text-zinc-500"
                data-ocid="experience.empty_state"
              >
                No experiences saved yet. Add one to override the default
                portfolio content.
              </div>
            ) : (
              <div className="grid gap-3">
                {experiences.map((exp, i) => (
                  <Card
                    key={String(exp.id)}
                    className="bg-zinc-900 border-zinc-800"
                    data-ocid={`experience.item.${i + 1}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-medium text-white">
                              {exp.title}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-xs border-zinc-700 text-zinc-400"
                            >
                              {exp.company}
                            </Badge>
                            {exp.period && (
                              <span className="text-xs text-zinc-500">
                                {exp.period}
                              </span>
                            )}
                          </div>
                          {exp.description && (
                            <p className="text-zinc-400 text-sm mt-1 leading-relaxed">
                              {exp.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startEditExp(exp)}
                            className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                            data-ocid={`experience.edit_button.${i + 1}`}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteExp(exp.id)}
                            className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                            data-ocid={`experience.delete_button.${i + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                Skill Categories
                <Badge className="ml-2 bg-violet-600/20 text-violet-400 border-violet-600/30">
                  {skills.length}
                </Badge>
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadSkills}
                  disabled={skillsLoading}
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  data-ocid="skills.secondary_button"
                >
                  {skillsLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    "Refresh"
                  )}
                </Button>
                {!skillShowAdd && (
                  <Button
                    size="sm"
                    onClick={() => setSkillShowAdd(true)}
                    className="bg-violet-600 hover:bg-violet-700 text-white gap-1"
                    data-ocid="skills.open_modal_button"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Category
                  </Button>
                )}
              </div>
            </div>

            {skillShowAdd && (
              <Card
                className="bg-zinc-900 border-zinc-700 mb-4"
                data-ocid="skills.panel"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-white flex items-center justify-between">
                    Add Skill Category
                    <button
                      type="button"
                      onClick={cancelSkillForm}
                      className="text-zinc-500 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <Label className={labelCls}>Category Name *</Label>
                    <Input
                      value={skillCategory}
                      onChange={(e) => setSkillCategory(e.target.value)}
                      placeholder="Design Skills"
                      className={inputCls}
                      data-ocid="skills.input"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className={labelCls}>
                      Items (one per line or comma-separated)
                    </Label>
                    <Textarea
                      value={skillItems}
                      onChange={(e) => setSkillItems(e.target.value)}
                      placeholder="Figma\nAdobe Photoshop\nIllustrator"
                      rows={4}
                      className={`${inputCls} resize-none`}
                      data-ocid="skills.textarea"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={cancelSkillForm}
                      className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                      data-ocid="skills.cancel_button"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveSkill}
                      disabled={skillSaving || !skillCategory}
                      className="bg-violet-600 hover:bg-violet-700 text-white"
                      data-ocid="skills.save_button"
                    >
                      {skillSaving ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                      ) : null}
                      Save
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {skillsLoading ? (
              <div
                className="flex items-center justify-center py-12 text-zinc-500"
                data-ocid="skills.loading_state"
              >
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading...
              </div>
            ) : skills.length === 0 ? (
              <div
                className="text-center py-12 text-zinc-500"
                data-ocid="skills.empty_state"
              >
                No skills saved yet. Add categories to override defaults.
              </div>
            ) : (
              <div className="grid gap-3">
                {skills.map((skill, i) => (
                  <Card
                    key={String(skill.id)}
                    className="bg-zinc-900 border-zinc-800"
                    data-ocid={`skills.item.${i + 1}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white mb-2">
                            {skill.category}
                          </p>
                          <p className="text-zinc-400 text-sm">
                            {skill.items.join(", ")}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteSkill(skill.id)}
                          className="text-red-500 hover:text-red-400 hover:bg-red-500/10 shrink-0"
                          data-ocid={`skills.delete_button.${i + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                Portfolio Projects
                <Badge className="ml-2 bg-violet-600/20 text-violet-400 border-violet-600/30">
                  {projects.length}
                </Badge>
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadProjects}
                  disabled={projLoading}
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  data-ocid="projects.secondary_button"
                >
                  {projLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    "Refresh"
                  )}
                </Button>
                {!projShowAdd && projEditId === null && (
                  <Button
                    size="sm"
                    onClick={() => setProjShowAdd(true)}
                    className="bg-violet-600 hover:bg-violet-700 text-white gap-1"
                    data-ocid="projects.open_modal_button"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Project
                  </Button>
                )}
              </div>
            </div>

            {(projShowAdd || projEditId !== null) && (
              <Card
                className="bg-zinc-900 border-zinc-700 mb-4"
                data-ocid="projects.panel"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-white flex items-center justify-between">
                    {projEditId !== null ? "Edit Project" : "Add Project"}
                    <button
                      type="button"
                      onClick={cancelProjForm}
                      className="text-zinc-500 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className={labelCls}>Title *</Label>
                      <Input
                        value={projTitle}
                        onChange={(e) => setProjTitle(e.target.value)}
                        placeholder="Music Broadcast"
                        className={inputCls}
                        data-ocid="projects.input"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className={labelCls}>Sort Order</Label>
                      <Input
                        value={projSortOrder}
                        onChange={(e) => setProjSortOrder(e.target.value)}
                        placeholder="1"
                        type="number"
                        className={inputCls}
                        data-ocid="projects.input"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className={labelCls}>Behance / Project URL *</Label>
                    <Input
                      value={projUrl}
                      onChange={(e) => setProjUrl(e.target.value)}
                      placeholder="https://www.behance.net/gallery/..."
                      className={inputCls}
                      data-ocid="projects.input"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className={labelCls}>
                      Thumbnail Image URL (optional)
                    </Label>
                    <Input
                      value={projImageUrl}
                      onChange={(e) => setProjImageUrl(e.target.value)}
                      placeholder="https://..."
                      className={inputCls}
                      data-ocid="projects.input"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={cancelProjForm}
                      className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                      data-ocid="projects.cancel_button"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveProj}
                      disabled={projSaving || !projTitle || !projUrl}
                      className="bg-violet-600 hover:bg-violet-700 text-white"
                      data-ocid="projects.save_button"
                    >
                      {projSaving ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                      ) : null}
                      {projEditId !== null ? "Update" : "Save"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {projLoading ? (
              <div
                className="flex items-center justify-center py-12 text-zinc-500"
                data-ocid="projects.loading_state"
              >
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading...
              </div>
            ) : projects.length === 0 ? (
              <div
                className="text-center py-12 text-zinc-500"
                data-ocid="projects.empty_state"
              >
                No projects saved yet. Add projects to override defaults.
              </div>
            ) : (
              <div className="grid gap-3">
                {projects.map((p, i) => (
                  <Card
                    key={String(p.id)}
                    className="bg-zinc-900 border-zinc-800"
                    data-ocid={`projects.item.${i + 1}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white mb-1">
                            {p.title}
                          </p>
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-violet-400 hover:underline truncate block"
                          >
                            {p.url}
                          </a>
                          {p.imageUrl && (
                            <p className="text-zinc-500 text-xs mt-1 truncate">
                              {p.imageUrl}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startEditProj(p)}
                            className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                            data-ocid={`projects.edit_button.${i + 1}`}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteProj(p.id)}
                            className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                            data-ocid={`projects.delete_button.${i + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
