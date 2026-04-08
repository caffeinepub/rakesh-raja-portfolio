import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Migration "migration";

(with migration = Migration.run)
actor {
  // ===== TYPES =====

  public type Review = {
    id : Text;
    name : Text;
    role : Text;
    company : Text;
    reviewText : Text;
    rating : Nat;
    timestamp : Int;
  };

  public type Experience = {
    id : Text;
    title : Text;
    company : Text;
    period : Text;
    description : Text;
    sortOrder : Nat;
  };

  public type SkillCategory = {
    id : Text;
    category : Text;
    items : [Text];
    sortOrder : Nat;
  };

  public type Project = {
    id : Text;
    title : Text;
    url : Text;
    imageUrl : Text;
    sortOrder : Nat;
  };

  public type ProfileSettings = {
    name : Text;
    greeting : Text;
    jobTitle : Text;
    tagline : Text;
    profilePhotoUrl : Text;
    resumeUrl : Text;
    resumeFileName : Text;
  };

  public type ContactSettings = {
    email : Text;
    phone : Text;
    location : Text;
    behanceUrl : Text;
    linkedinUrl : Text;
    instagramUrl : Text;
  };

  public type Education = {
    id : Text;
    degree : Text;
    college : Text;
    year : Text;
    sortOrder : Nat;
  };

  public type AllData = {
    reviews : [Review];
    experiences : [Experience];
    skills : [SkillCategory];
    projects : [Project];
    profile : ?ProfileSettings;
    contact : ?ContactSettings;
    educations : [Education];
    totalVisits : Nat;
    dailyVisits : [(Text, Nat)];
  };

  // ===== STATE =====
  // Enhanced orthogonal persistence — no stable keyword needed

  let reviewStore = Map.empty<Text, Review>();
  let experienceStore = Map.empty<Text, Experience>();
  let skillStore = Map.empty<Text, SkillCategory>();
  let projectStore = Map.empty<Text, Project>();
  let visitStore = Map.empty<Text, Nat>();
  let educationStore = Map.empty<Text, Education>();

  var adminPin : Text = "rakesh2025";
  var profileSettings : ?ProfileSettings = null;
  var contactSettings : ?ContactSettings = null;
  var nextReviewId : Nat = 0;
  var nextExperienceId : Nat = 0;
  var nextSkillId : Nat = 0;
  var nextProjectId : Nat = 0;
  var nextEducationId : Nat = 0;

  // ===== SEED DEFAULT DATA ON FIRST DEPLOY =====

  do {
    let defaultExperiences : [Experience] = [
      { id = "0"; title = "Designer & Video Editor"; company = "SQE One Free Launching"; period = "2025 – Present"; description = "UI/UX design and video editing for product launches and digital campaigns."; sortOrder = 0 },
      { id = "1"; title = "UI & Visual Designer"; company = "Freelance"; period = "2022 – 2025"; description = "Branding, UI design, and motion graphics for diverse clients across industries."; sortOrder = 1 },
      { id = "2"; title = "Graphic Designer"; company = "Royal Land & Developers Pvt Ltd"; period = "2021 – 2022"; description = "Marketing collateral, social media graphics, and brand identity for a real estate firm."; sortOrder = 2 },
      { id = "3"; title = "Visual Designer"; company = "Freelance"; period = "2020 – 2021"; description = "International projects and digital branding. Delivered cross-cultural visual solutions for an EdTech platform."; sortOrder = 3 },
    ];
    for (e in defaultExperiences.vals()) { experienceStore.add(e.id, e) };
    nextExperienceId := defaultExperiences.size();

    let defaultSkills : [SkillCategory] = [
      { id = "0"; category = "Design Skills"; items = ["UI Design", "Visual Design", "Branding & Identity", "Typography", "Motion Graphics", "Video Editing", "Social Media Design", "Print Design"]; sortOrder = 0 },
      { id = "1"; category = "Tools"; items = ["Figma", "Adobe Photoshop", "Adobe Illustrator", "Adobe Premiere Pro", "Adobe After Effects", "Adobe XD", "Canva", "DaVinci Resolve"]; sortOrder = 1 },
    ];
    for (s in defaultSkills.vals()) { skillStore.add(s.id, s) };
    nextSkillId := defaultSkills.size();

    let defaultProjects : [Project] = [
      { id = "0"; title = "Music Broadcast"; url = "https://www.behance.net/gallery/246296377/MUSIC-BROADCAST"; imageUrl = "https://mir-s3-cdn-cf.behance.net/projects/404/cc71bc246296377.Y3JvcCwxMjU1LDk4MiwyNDgsMA.png"; sortOrder = 0 },
      { id = "1"; title = "SQE Project Landing Page"; url = "https://www.behance.net/gallery/246270145/sqe-project-landing-page"; imageUrl = "https://mir-s3-cdn-cf.behance.net/projects/404/9b8f5f246270145.Y3JvcCwxMjE0LDk0OSwwLDA.png"; sortOrder = 1 },
      { id = "2"; title = "DLD Website"; url = "https://www.behance.net/gallery/246264307/dld-website"; imageUrl = "https://mir-s3-cdn-cf.behance.net/projects/404/c07379246264307.Y3JvcCwxMzUwLDEwNTUsMCwxNzA3.png"; sortOrder = 2 },
      { id = "3"; title = "SQE Website"; url = "https://www.behance.net/gallery/246209947/sqe-website"; imageUrl = "https://mir-s3-cdn-cf.behance.net/projects/404/f517f1246209947.Y3JvcCwxOTA0LDE0ODksMCww.png"; sortOrder = 3 },
      { id = "4"; title = "Dashboard UI"; url = "https://www.behance.net/gallery/245993215/dashboard"; imageUrl = "https://mir-s3-cdn-cf.behance.net/projects/404/0bbf1f245993215.Y3JvcCw4MTMsNjM2LDMxMiwyODI.png"; sortOrder = 4 },
      { id = "5"; title = "Food Ordering Tablet App"; url = "https://www.behance.net/gallery/245980909/food-ordering-tablet-app"; imageUrl = "https://mir-s3-cdn-cf.behance.net/projects/404/18d088245980909.Y3JvcCwxNjY0LDEzMDEsNDA3LDE5Nw.png"; sortOrder = 5 },
      { id = "6"; title = "Landing Page"; url = "https://www.behance.net/gallery/245978901/landing-page"; imageUrl = "https://mir-s3-cdn-cf.behance.net/projects/404/9b89d9245978901.Y3JvcCwyNDgwLDE5MzksMCw0NjY.jpg"; sortOrder = 6 },
      { id = "7"; title = "Flyer Design"; url = "https://www.behance.net/gallery/244805011/Flyer"; imageUrl = "https://mir-s3-cdn-cf.behance.net/projects/404/9f5760244805011.69b9e97c1ec32.jpg"; sortOrder = 7 },
      { id = "8"; title = "Investment Posters"; url = "https://www.behance.net/gallery/243774561/Investment-posters"; imageUrl = "https://mir-s3-cdn-cf.behance.net/projects/404/d7d70d243774561.69aaed6eab1ef.jpg"; sortOrder = 8 },
      { id = "9"; title = "Valentine's Day Posters"; url = "https://www.behance.net/gallery/243774207/Valentine-day-special-posters"; imageUrl = "https://mir-s3-cdn-cf.behance.net/projects/404/44c6d7243774207.6994cc6bad7e6.jpg"; sortOrder = 9 },
      { id = "10"; title = "Poster Design"; url = "https://www.behance.net/gallery/243333301/Poster-design"; imageUrl = "https://mir-s3-cdn-cf.behance.net/projects/404/622b71243333301.6994cbb8ab7a0.jpg"; sortOrder = 10 },
      { id = "11"; title = "E-Commerce VIDEO"; url = "https://www.behance.net/gallery/203160409/E-Commerce-VIDEO"; imageUrl = "https://mir-s3-cdn-cf.behance.net/projects/404/203160409.jpg"; sortOrder = 11 },
    ];
    for (p in defaultProjects.vals()) { projectStore.add(p.id, p) };
    nextProjectId := defaultProjects.size();

    let defaultEducations : [Education] = [
      { id = "0"; degree = "Master of Computer Applications (MCA)"; college = "FX Engineering College"; year = "2017"; sortOrder = 0 },
      { id = "1"; degree = "Bachelor of Computer Applications (BCA)"; college = "St. John's College"; year = "2014"; sortOrder = 1 },
    ];
    for (edu in defaultEducations.vals()) { educationStore.add(edu.id, edu) };
    nextEducationId := defaultEducations.size();
  };

  // ===== HELPERS =====

  func compareByTimestampDesc(a : Review, b : Review) : Order.Order {
    Int.compare(b.timestamp, a.timestamp);
  };

  func compareExperiences(a : Experience, b : Experience) : Order.Order {
    Nat.compare(a.sortOrder, b.sortOrder);
  };

  func compareSkills(a : SkillCategory, b : SkillCategory) : Order.Order {
    Nat.compare(a.sortOrder, b.sortOrder);
  };

  func compareProjects(a : Project, b : Project) : Order.Order {
    Nat.compare(a.sortOrder, b.sortOrder);
  };

  func compareEducations(a : Education, b : Education) : Order.Order {
    Nat.compare(a.sortOrder, b.sortOrder);
  };

  func natToText(n : Nat) : Text {
    n.toText();
  };

  // ===== ADMIN =====

  public query func verifyAdmin(pin : Text) : async Bool {
    pin == adminPin;
  };

  public shared func setAdminPin(currentPin : Text, newPin : Text) : async Bool {
    if (currentPin != adminPin) { return false };
    adminPin := newPin;
    true;
  };

  // ===== PROFILE SETTINGS =====

  public query func getProfileSettings() : async ?ProfileSettings {
    profileSettings;
  };

  public shared func setProfileSettings(pin : Text, settings : ProfileSettings) : async Bool {
    if (pin != adminPin) { return false };
    profileSettings := ?settings;
    true;
  };

  // ===== CONTACT SETTINGS =====

  public query func getContactSettings() : async ?ContactSettings {
    contactSettings;
  };

  public shared func setContactSettings(pin : Text, settings : ContactSettings) : async Bool {
    if (pin != adminPin) { return false };
    contactSettings := ?settings;
    true;
  };

  // ===== EDUCATION =====

  public query func getEducations() : async [Education] {
    educationStore.values().sort(compareEducations).toArray();
  };

  public shared func addEducation(pin : Text, edu : Education) : async Bool {
    if (pin != adminPin) { return false };
    let id = natToText(nextEducationId);
    educationStore.add(id, { edu with id });
    nextEducationId += 1;
    true;
  };

  public shared func updateEducation(pin : Text, id : Text, edu : Education) : async Bool {
    if (pin != adminPin) { return false };
    switch (educationStore.get(id)) {
      case (null) { false };
      case (?_) {
        educationStore.add(id, { edu with id });
        true;
      };
    };
  };

  public shared func deleteEducation(pin : Text, id : Text) : async Bool {
    if (pin != adminPin) { return false };
    switch (educationStore.get(id)) {
      case (null) { false };
      case (?_) {
        educationStore.remove(id);
        true;
      };
    };
  };

  // ===== REVIEWS =====

  public shared func submitReview(review : Review) : async Bool {
    if (review.name == "") { Runtime.trap("Name cannot be empty") };
    if (review.reviewText == "") { Runtime.trap("Review text cannot be empty") };
    if (review.rating < 1 or review.rating > 5) { Runtime.trap("Rating must be 1-5") };
    let id = natToText(nextReviewId);
    reviewStore.add(id, { review with id; timestamp = Time.now() });
    nextReviewId += 1;
    true;
  };

  public shared func deleteReview(pin : Text, id : Text) : async Bool {
    if (pin != adminPin) { return false };
    switch (reviewStore.get(id)) {
      case (null) { false };
      case (?_) {
        reviewStore.remove(id);
        true;
      };
    };
  };

  public query func getReviews() : async [Review] {
    reviewStore.values().sort(compareByTimestampDesc).toArray();
  };

  public query func getReviewCount() : async Nat {
    reviewStore.size();
  };

  // ===== EXPERIENCES =====

  public shared func addExperience(pin : Text, exp : Experience) : async Bool {
    if (pin != adminPin) { return false };
    let id = natToText(nextExperienceId);
    experienceStore.add(id, { exp with id });
    nextExperienceId += 1;
    true;
  };

  public shared func updateExperience(pin : Text, id : Text, exp : Experience) : async Bool {
    if (pin != adminPin) { return false };
    switch (experienceStore.get(id)) {
      case (null) { false };
      case (?_) {
        experienceStore.add(id, { exp with id });
        true;
      };
    };
  };

  public shared func deleteExperience(pin : Text, id : Text) : async Bool {
    if (pin != adminPin) { return false };
    switch (experienceStore.get(id)) {
      case (null) { false };
      case (?_) {
        experienceStore.remove(id);
        true;
      };
    };
  };

  public query func getExperiences() : async [Experience] {
    experienceStore.values().sort(compareExperiences).toArray();
  };

  // ===== SKILLS =====

  public shared func addSkillCategory(pin : Text, cat : SkillCategory) : async Bool {
    if (pin != adminPin) { return false };
    let id = natToText(nextSkillId);
    skillStore.add(id, { cat with id });
    nextSkillId += 1;
    true;
  };

  public shared func updateSkillCategory(pin : Text, id : Text, cat : SkillCategory) : async Bool {
    if (pin != adminPin) { return false };
    switch (skillStore.get(id)) {
      case (null) { false };
      case (?_) {
        skillStore.add(id, { cat with id });
        true;
      };
    };
  };

  public shared func deleteSkillCategory(pin : Text, id : Text) : async Bool {
    if (pin != adminPin) { return false };
    switch (skillStore.get(id)) {
      case (null) { false };
      case (?_) {
        skillStore.remove(id);
        true;
      };
    };
  };

  public query func getSkills() : async [SkillCategory] {
    skillStore.values().sort(compareSkills).toArray();
  };

  // ===== PROJECTS =====

  public shared func addProject(pin : Text, proj : Project) : async Bool {
    if (pin != adminPin) { return false };
    let id = natToText(nextProjectId);
    projectStore.add(id, { proj with id });
    nextProjectId += 1;
    true;
  };

  public shared func updateProject(pin : Text, id : Text, proj : Project) : async Bool {
    if (pin != adminPin) { return false };
    switch (projectStore.get(id)) {
      case (null) { false };
      case (?_) {
        projectStore.add(id, { proj with id });
        true;
      };
    };
  };

  public shared func deleteProject(pin : Text, id : Text) : async Bool {
    if (pin != adminPin) { return false };
    switch (projectStore.get(id)) {
      case (null) { false };
      case (?_) {
        projectStore.remove(id);
        true;
      };
    };
  };

  public query func getProjects() : async [Project] {
    projectStore.values().sort(compareProjects).toArray();
  };

  // ===== VISITS =====

  public shared func recordVisit() : async () {
    let now = Time.now();
    // Convert nanoseconds to a date string YYYY-MM-DD approximation using day index
    let dayIndex = (now / 86_400_000_000_000).toNat();
    let dateKey = natToText(dayIndex);
    let current = switch (visitStore.get(dateKey)) {
      case (null) { 0 };
      case (?n) { n };
    };
    visitStore.add(dateKey, current + 1);
  };

  public query func getTotalVisits() : async Nat {
    visitStore.values().foldLeft(0, func(acc : Nat, n : Nat) : Nat { acc + n });
  };

  public query func getDailyVisits() : async [(Text, Nat)] {
    visitStore.entries().toArray();
  };

  // ===== ALL DATA =====

  public query func getAllData() : async AllData {
    let totalVisits = visitStore.values().foldLeft(0, func(acc : Nat, n : Nat) : Nat { acc + n });
    {
      reviews = reviewStore.values().sort(compareByTimestampDesc).toArray();
      experiences = experienceStore.values().sort(compareExperiences).toArray();
      skills = skillStore.values().sort(compareSkills).toArray();
      projects = projectStore.values().sort(compareProjects).toArray();
      profile = profileSettings;
      contact = contactSettings;
      educations = educationStore.values().sort(compareEducations).toArray();
      totalVisits;
      dailyVisits = visitStore.entries().toArray();
    };
  };
};
