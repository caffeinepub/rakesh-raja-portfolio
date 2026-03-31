import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Migration "migration";

(with migration = Migration.run)
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

  let reviewStore = Map.empty<Nat, Review>();
  let experienceStore = Map.empty<Nat, Experience>();
  let skillStore = Map.empty<Nat, SkillCategory>();
  let projectStore = Map.empty<Nat, Project>();
  let visitStore = Map.empty<Text, Nat>();

  var nextExperienceId = 0;
  var nextSkillId = 0;
  var nextProjectId = 0;

  var adminPin : Text = "rakesh2025";

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

  public query func verifyAdmin(pin : Text) : async Bool {
    pin == adminPin;
  };

  public shared func setAdminPin(oldPin : Text, newPin : Text) : async Bool {
    if (oldPin != adminPin) {
      return false;
    };
    if (newPin == "") { return false };
    adminPin := newPin;
    true;
  };

  public query func getReview(id : Nat) : async Review {
    switch (reviewStore.get(id)) {
      case (null) { Runtime.trap("Review not found") };
      case (?r) { r };
    };
  };

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
