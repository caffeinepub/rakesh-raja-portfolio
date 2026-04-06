import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";



actor {
  type Review = {
    id : Nat;
    name : Text;
    role : Text;
    company : Text;
    reviewText : Text;
    rating : Nat;
    timestamp : Int;
  };

  type Experience = {
    id : Nat;
    title : Text;
    company : Text;
    period : Text;
    description : Text;
    sortOrder : Nat;
  };

  type SkillCategory = {
    id : Nat;
    category : Text;
    items : [Text];
    sortOrder : Nat;
  };

  type Project = {
    id : Nat;
    title : Text;
    url : Text;
    imageUrl : Text;
    sortOrder : Nat;
  };

  type VisitRecord = {
    date : Text;
    count : Nat;
  };

  type ProfileSettings = {
    name : Text;
    greeting : Text;
    jobTitle : Text;
    tagline : Text;
    profilePhotoUrl : Text;
    resumeUrl : Text;
    resumeFileName : Text;
  };

  type ContactSettings = {
    email : Text;
    phone : Text;
    location : Text;
    behanceUrl : Text;
    linkedinUrl : Text;
    instagramUrl : Text;
  };

  type Education = {
    id : Nat;
    degree : Text;
    college : Text;
    year : Text;
    sortOrder : Nat;
  };

  // Stable storage arrays - persist across upgrades
  stable var stableReviews : [Review] = [];
  stable var stableExperiences : [Experience] = [];
  stable var stableSkills : [SkillCategory] = [];
  stable var stableProjects : [Project] = [];
  stable var stableVisits : [(Text, Nat)] = [];
  stable var stableNextExperienceId : Nat = 0;
  stable var stableNextSkillId : Nat = 0;
  stable var stableNextProjectId : Nat = 0;
  stable var adminPin : Text = "rakesh2025";

  // Profile & Contact stable storage
  stable var stableProfile : ?ProfileSettings = null;
  stable var stableContact : ?ContactSettings = null;
  stable var stableEducations : [Education] = [];
  stable var stableNextEducationId : Nat = 0;

  // In-memory maps rebuilt from stable storage
  let reviewStore = Map.empty<Nat, Review>();
  let experienceStore = Map.empty<Nat, Experience>();
  let skillStore = Map.empty<Nat, SkillCategory>();
  let projectStore = Map.empty<Nat, Project>();
  let visitStore = Map.empty<Text, Nat>();
  let educationStore = Map.empty<Nat, Education>();

  var nextExperienceId = stableNextExperienceId;
  var nextSkillId = stableNextSkillId;
  var nextProjectId = stableNextProjectId;
  var nextEducationId = stableNextEducationId;

  var profileSettings : ?ProfileSettings = stableProfile;
  var contactSettings : ?ContactSettings = stableContact;

  // Restore from stable storage on upgrade
  do {
    for (r in stableReviews.vals()) { reviewStore.add(r.id, r) };
    for (e in stableExperiences.vals()) { experienceStore.add(e.id, e) };
    for (s in stableSkills.vals()) { skillStore.add(s.id, s) };
    for (p in stableProjects.vals()) { projectStore.add(p.id, p) };
    for ((date, count) in stableVisits.vals()) { visitStore.add(date, count) };
    for (edu in stableEducations.vals()) { educationStore.add(edu.id, edu) };
  };

  // Seed default data if stores are empty (first deploy)
  do {
    if (experienceStore.size() == 0) {
      let defaults : [Experience] = [
        { id = 0; title = "Designer & Video Editor"; company = "SQE One Free Launching"; period = "2025 – Present"; description = "UI/UX design and video editing for product launches and digital campaigns."; sortOrder = 0 },
        { id = 1; title = "UI & Visual Designer"; company = "Freelance"; period = "2022 – 2025"; description = "Branding, UI design, and motion graphics for diverse clients across industries."; sortOrder = 1 },
        { id = 2; title = "Graphic Designer"; company = "Royal Land & Developers Pvt Ltd"; period = "2021 – 2022"; description = "Marketing collateral, social media graphics, and brand identity for a real estate firm."; sortOrder = 2 },
        { id = 3; title = "Visual Designer"; company = "Freelance"; period = "2020 – 2021"; description = "International projects and digital branding. Delivered cross-cultural visual solutions for an EdTech platform."; sortOrder = 3 },
      ];
      for (e in defaults.vals()) { experienceStore.add(e.id, e) };
      nextExperienceId := defaults.size();
    };

    if (skillStore.size() == 0) {
      let defaults : [SkillCategory] = [
        { id = 0; category = "Design Skills"; items = ["UI Design", "Visual Design", "Branding & Identity", "Typography", "Motion Graphics", "Video Editing", "Social Media Design", "Print Design"]; sortOrder = 0 },
        { id = 1; category = "Tools"; items = ["Figma", "Adobe Photoshop", "Adobe Illustrator", "Adobe Premiere Pro", "Adobe After Effects", "Adobe XD", "Canva", "DaVinci Resolve"]; sortOrder = 1 },
      ];
      for (s in defaults.vals()) { skillStore.add(s.id, s) };
      nextSkillId := defaults.size();
    };

    if (projectStore.size() == 0) {
      let defaults : [Project] = [
        { id = 0; title = "Music Broadcast"; url = "https://www.behance.net/gallery/246296377/MUSIC-BROADCAST"; imageUrl = "https://mir-s3-cdn-cf.behance.net/projects/404/cc71bc246296377.Y3JvcCwxMjU1LDk4MiwyNDgsMA.png"; sortOrder = 0 },
        { id = 1; title = "SQE Project Landing Page"; url = "https://www.behance.net/gallery/246270145/sqe-project-landing-page"; imageUrl = "https://mir-s3-cdn-cf.behance.net/projects/404/9b8f5f246270145.Y3JvcCwxMjE0LDk0OSwwLDA.png"; sortOrder = 1 },
        { id = 2; title = "DLD Website"; url = "https://www.behance.net/gallery/246264307/dld-website"; imageUrl = "https://mir-s3-cdn-cf.behance.net/projects/404/c07379246264307.Y3JvcCwxMzUwLDEwNTUsMCwxNzA3.png"; sortOrder = 2 },
        { id = 3; title = "SQE Website"; url = "https://www.behance.net/gallery/246209947/sqe-website"; imageUrl = "https://mir-s3-cdn-cf.behance.net/projects/404/f517f1246209947.Y3JvcCwxOTA0LDE0ODksMCww.png"; sortOrder = 3 },
        { id = 4; title = "Dashboard UI"; url = "https://www.behance.net/gallery/245993215/dashboard"; imageUrl = "https://mir-s3-cdn-cf.behance.net/projects/404/0bbf1f245993215.Y3JvcCw4MTMsNjM2LDMxMiwyODI.png"; sortOrder = 4 },
        { id = 5; title = "Food Ordering Tablet App"; url = "https://www.behance.net/gallery/245980909/food-ordering-tablet-app"; imageUrl = "https://mir-s3-cdn-cf.behance.net/projects/404/18d088245980909.Y3JvcCwxNjY0LDEzMDEsNDA3LDE5Nw.png"; sortOrder = 5 },
        { id = 6; title = "Landing Page"; url = "https://www.behance.net/gallery/245978901/landing-page"; imageUrl = "https://mir-s3-cdn-cf.behance.net/projects/404/9b89d9245978901.Y3JvcCwyNDgwLDE5MzksMCw0NjY.jpg"; sortOrder = 6 },
        { id = 7; title = "Flyer Design"; url = "https://www.behance.net/gallery/244805011/Flyer"; imageUrl = "https://mir-s3-cdn-cf.behance.net/projects/404/9f5760244805011.69b9e97c1ec32.jpg"; sortOrder = 7 },
        { id = 8; title = "Investment Posters"; url = "https://www.behance.net/gallery/243774561/Investment-posters"; imageUrl = "https://mir-s3-cdn-cf.behance.net/projects/404/d7d70d243774561.69aaed6eab1ef.jpg"; sortOrder = 8 },
        { id = 9; title = "Valentine's Day Posters"; url = "https://www.behance.net/gallery/243774207/Valentine-day-special-posters"; imageUrl = "https://mir-s3-cdn-cf.behance.net/projects/404/44c6d7243774207.6994cc6bad7e6.jpg"; sortOrder = 9 },
        { id = 10; title = "Poster Design"; url = "https://www.behance.net/gallery/243333301/Poster-design"; imageUrl = "https://mir-s3-cdn-cf.behance.net/projects/404/622b71243333301.6994cbb8ab7a0.jpg"; sortOrder = 10 },
        { id = 11; title = "E-Commerce VIDEO"; url = "https://www.behance.net/gallery/203160409/E-Commerce-VIDEO"; imageUrl = "https://mir-s3-cdn-cf.behance.net/projects/404/203160409.jpg"; sortOrder = 11 },
      ];
      for (p in defaults.vals()) { projectStore.add(p.id, p) };
      nextProjectId := defaults.size();
    };

    if (educationStore.size() == 0) {
      let defaults : [Education] = [
        { id = 0; degree = "Master of Computer Applications (MCA)"; college = "FX Engineering College"; year = "2017"; sortOrder = 0 },
        { id = 1; degree = "Bachelor of Computer Applications (BCA)"; college = "St. John's College"; year = "2014"; sortOrder = 1 },
      ];
      for (edu in defaults.vals()) { educationStore.add(edu.id, edu) };
      nextEducationId := defaults.size();
    };
  };

  // Save to stable storage before upgrades
  system func preupgrade() {
    stableReviews := reviewStore.values().toArray();
    stableExperiences := experienceStore.values().toArray();
    stableSkills := skillStore.values().toArray();
    stableProjects := projectStore.values().toArray();
    stableVisits := visitStore.entries().toArray();
    stableNextExperienceId := nextExperienceId;
    stableNextSkillId := nextSkillId;
    stableNextProjectId := nextProjectId;
    stableProfile := profileSettings;
    stableContact := contactSettings;
    stableEducations := educationStore.values().toArray();
    stableNextEducationId := nextEducationId;
  };

  func compareReviewsByTimeDesc(a : Review, b : Review) : Order.Order {
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

  public query func verifyAdmin(pin : Text) : async Bool {
    pin == adminPin;
  };

  public shared func setAdminPin(oldPin : Text, newPin : Text) : async Bool {
    if (oldPin != adminPin) { return false };
    adminPin := newPin;
    true;
  };

  // ===== PROFILE SETTINGS =====
  public query func getProfileSettings() : async ?ProfileSettings {
    profileSettings;
  };

  public shared func setProfileSettings(pin : Text, name : Text, greeting : Text, jobTitle : Text, tagline : Text, profilePhotoUrl : Text, resumeUrl : Text, resumeFileName : Text) : async Bool {
    if (pin != adminPin) { return false };
    profileSettings := ?{
      name;
      greeting;
      jobTitle;
      tagline;
      profilePhotoUrl;
      resumeUrl;
      resumeFileName;
    };
    true;
  };

  // ===== CONTACT SETTINGS =====
  public query func getContactSettings() : async ?ContactSettings {
    contactSettings;
  };

  public shared func setContactSettings(pin : Text, email : Text, phone : Text, location : Text, behanceUrl : Text, linkedinUrl : Text, instagramUrl : Text) : async Bool {
    if (pin != adminPin) { return false };
    contactSettings := ?{
      email;
      phone;
      location;
      behanceUrl;
      linkedinUrl;
      instagramUrl;
    };
    true;
  };

  // ===== EDUCATION =====
  public query func getEducations() : async [Education] {
    educationStore.values().sort(compareEducations).toArray();
  };

  public shared ({ caller }) func addEducation(pin : Text, degree : Text, college : Text, year : Text, sortOrder : Nat) : async Nat {
    if (pin != adminPin) { Runtime.trap("Unauthorized") };
    let edu : Education = {
      id = nextEducationId;
      degree; college; year; sortOrder;
    };
    educationStore.add(nextEducationId, edu);
    nextEducationId += 1;
    edu.id;
  };

  public shared ({ caller }) func updateEducation(pin : Text, id : Nat, degree : Text, college : Text, year : Text, sortOrder : Nat) : async Bool {
    if (pin != adminPin) { Runtime.trap("Unauthorized") };
    switch (educationStore.get(id)) {
      case (null) { Runtime.trap("Education not found") };
      case (?_) {
        educationStore.add(id, { id; degree; college; year; sortOrder });
        true;
      };
    };
  };

  public shared ({ caller }) func deleteEducation(pin : Text, id : Nat) : async Bool {
    if (pin != adminPin) { Runtime.trap("Unauthorized") };
    switch (educationStore.get(id)) {
      case (null) { Runtime.trap("Education not found") };
      case (?_) {
        let _ = educationStore.remove(id);
        true;
      };
    };
  };

  // ===== REVIEWS =====
  public shared func submitReview(name : Text, role : Text, company : Text, reviewText : Text, rating : Nat) : async Nat {
    if (name == "") { Runtime.trap("Name cannot be empty") };
    if (reviewText == "") { Runtime.trap("Review text cannot be empty") };
    if (rating < 1 or rating > 5) { Runtime.trap("Rating must be 1-5") };
    let review : Review = {
      id = reviewStore.size();
      name; role; company; reviewText; rating;
      timestamp = Time.now();
    };
    reviewStore.add(reviewStore.size(), review);
    review.id;
  };

  public shared func deleteReview(pin : Text, id : Nat) : async Bool {
    if (pin != adminPin) { return false };
    switch (reviewStore.get(id)) {
      case (null) { false };
      case (?_) {
        let _ = reviewStore.remove(id);
        true;
      };
    };
  };

  public query func getReviews() : async [Review] {
    reviewStore.values().sort(compareReviewsByTimeDesc).toArray();
  };

  public query func getReviewCount() : async Nat {
    reviewStore.size();
  };

  public shared ({ caller }) func addExperience(pin : Text, title : Text, company : Text, period : Text, description : Text, sortOrder : Nat) : async Nat {
    if (pin != adminPin) { Runtime.trap("Unauthorized") };
    let exp : Experience = {
      id = nextExperienceId;
      title; company; period; description; sortOrder;
    };
    experienceStore.add(nextExperienceId, exp);
    nextExperienceId += 1;
    exp.id;
  };

  public shared ({ caller }) func updateExperience(pin : Text, id : Nat, title : Text, company : Text, period : Text, description : Text, sortOrder : Nat) : async Bool {
    if (pin != adminPin) { Runtime.trap("Unauthorized") };
    switch (experienceStore.get(id)) {
      case (null) { Runtime.trap("Experience not found") };
      case (?exp) {
        let updatedExp : Experience = {
          id;
          title;
          company;
          period;
          description;
          sortOrder;
        };
        experienceStore.add(id, updatedExp);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteExperience(pin : Text, id : Nat) : async Bool {
    if (pin != adminPin) { Runtime.trap("Unauthorized") };
    switch (experienceStore.get(id)) {
      case (null) { Runtime.trap("Experience not found") };
      case (?_) {
        let _ = experienceStore.remove(id);
        true;
      };
    };
  };

  public query func getExperiences() : async [Experience] {
    experienceStore.values().sort(compareExperiences).toArray();
  };

  public shared ({ caller }) func addSkillCategory(pin : Text, category : Text, items : [Text], sortOrder : Nat) : async Nat {
    if (pin != adminPin) { Runtime.trap("Unauthorized") };
    let skill : SkillCategory = {
      id = nextSkillId;
      category; items; sortOrder;
    };
    skillStore.add(nextSkillId, skill);
    nextSkillId += 1;
    skill.id;
  };

  public shared ({ caller }) func deleteSkillCategory(pin : Text, id : Nat) : async Bool {
    if (pin != adminPin) { Runtime.trap("Unauthorized") };
    switch (skillStore.get(id)) {
      case (null) { Runtime.trap("Skill category not found") };
      case (?_) {
        let _ = skillStore.remove(id);
        true;
      };
    };
  };

  public query func getSkills() : async [SkillCategory] {
    skillStore.values().sort(compareSkills).toArray();
  };

  public shared ({ caller }) func addProject(pin : Text, title : Text, url : Text, imageUrl : Text, sortOrder : Nat) : async Nat {
    if (pin != adminPin) { Runtime.trap("Unauthorized") };
    let proj : Project = {
      id = nextProjectId;
      title; url; imageUrl; sortOrder;
    };
    projectStore.add(nextProjectId, proj);
    nextProjectId += 1;
    proj.id;
  };

  public shared ({ caller }) func updateProject(pin : Text, id : Nat, title : Text, url : Text, imageUrl : Text, sortOrder : Nat) : async Bool {
    if (pin != adminPin) { Runtime.trap("Unauthorized") };
    switch (projectStore.get(id)) {
      case (null) { Runtime.trap("Project not found") };
      case (?proj) {
        let updatedProj : Project = {
          id;
          title;
          url;
          imageUrl;
          sortOrder;
        };
        projectStore.add(id, updatedProj);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteProject(pin : Text, id : Nat) : async Bool {
    if (pin != adminPin) { Runtime.trap("Unauthorized") };
    switch (projectStore.get(id)) {
      case (null) { Runtime.trap("Project not found") };
      case (?_) {
        let _ = projectStore.remove(id);
        true;
      };
    };
  };

  public query func getProjects() : async [Project] {
    projectStore.values().sort(compareProjects).toArray();
  };

  public query func getTotalVisits() : async Nat {
    visitStore.values().foldLeft(0, func(acc, n) { acc + n });
  };

  public shared ({ caller }) func recordVisit(dateStr : Text) : async () {
    let current = switch (visitStore.get(dateStr)) {
      case (null) { 0 };
      case (?n) { n };
    };
    visitStore.add(dateStr, current + 1);
  };

  public query func getDailyVisits() : async [VisitRecord] {
    let visits = visitStore.entries();
    visits.map<(Text, Nat), VisitRecord>(func((date, count)) { { date; count } }).toArray();
  };

  public query func getAllData() : async {
    reviews : [Review];
    experiences : [Experience];
    skills : [SkillCategory];
    projects : [Project];
    totalVisits : Nat;
    dailyVisits : [VisitRecord];
  } {
    let totalVisits = visitStore.values().foldLeft(0, func(acc, n) { acc + n });
    let dailyVisits = visitStore.entries().map(func((date, count)) { { date; count } }).toArray();

    {
      reviews = reviewStore.values().sort(compareReviewsByTimeDesc).toArray();
      experiences = experienceStore.values().sort(compareExperiences).toArray();
      skills = skillStore.values().sort(compareSkills).toArray();
      projects = projectStore.values().sort(compareProjects).toArray();
      totalVisits;
      dailyVisits;
    };
  };
};
