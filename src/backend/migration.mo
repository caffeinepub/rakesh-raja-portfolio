import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";

module {
  // ===== OLD TYPES (from previous version — Nat IDs, classical persistence) =====

  type OldReview = {
    id : Nat;
    name : Text;
    role : Text;
    company : Text;
    reviewText : Text;
    rating : Nat;
    timestamp : Int;
  };

  type OldExperience = {
    id : Nat;
    title : Text;
    company : Text;
    period : Text;
    description : Text;
    sortOrder : Nat;
  };

  type OldSkillCategory = {
    id : Nat;
    category : Text;
    items : [Text];
    sortOrder : Nat;
  };

  type OldProject = {
    id : Nat;
    title : Text;
    url : Text;
    imageUrl : Text;
    sortOrder : Nat;
  };

  type OldEducation = {
    id : Nat;
    degree : Text;
    college : Text;
    year : Text;
    sortOrder : Nat;
  };

  type OldProfileSettings = {
    name : Text;
    greeting : Text;
    jobTitle : Text;
    tagline : Text;
    profilePhotoUrl : Text;
    resumeUrl : Text;
    resumeFileName : Text;
  };

  type OldContactSettings = {
    email : Text;
    phone : Text;
    location : Text;
    behanceUrl : Text;
    linkedinUrl : Text;
    instagramUrl : Text;
  };

  // ===== NEW TYPES (Text IDs) =====

  type NewReview = {
    id : Text;
    name : Text;
    role : Text;
    company : Text;
    reviewText : Text;
    rating : Nat;
    timestamp : Int;
  };

  type NewExperience = {
    id : Text;
    title : Text;
    company : Text;
    period : Text;
    description : Text;
    sortOrder : Nat;
  };

  type NewSkillCategory = {
    id : Text;
    category : Text;
    items : [Text];
    sortOrder : Nat;
  };

  type NewProject = {
    id : Text;
    title : Text;
    url : Text;
    imageUrl : Text;
    sortOrder : Nat;
  };

  type NewEducation = {
    id : Text;
    degree : Text;
    college : Text;
    year : Text;
    sortOrder : Nat;
  };

  // ===== MIGRATION STATE TYPES =====
  // OldActor must include ALL stable fields from the previous version:
  // - stable var arrays (stableXxx) used by classical preupgrade/postupgrade
  // - the Map-based stores (Nat keys) that were actor-level let bindings
  // - scalar var fields

  type OldActor = {
    // Classical stable arrays
    stableReviews : [OldReview];
    stableExperiences : [OldExperience];
    stableSkills : [OldSkillCategory];
    stableProjects : [OldProject];
    stableVisits : [(Text, Nat)];
    stableNextExperienceId : Nat;
    stableNextSkillId : Nat;
    stableNextProjectId : Nat;
    var adminPin : Text;
    stableProfile : ?OldProfileSettings;
    stableContact : ?OldContactSettings;
    stableEducations : [OldEducation];
    stableNextEducationId : Nat;
    // Map-based stores with Nat keys (also persisted via enhanced orthogonal persistence)
    reviewStore : Map.Map<Nat, OldReview>;
    experienceStore : Map.Map<Nat, OldExperience>;
    skillStore : Map.Map<Nat, OldSkillCategory>;
    projectStore : Map.Map<Nat, OldProject>;
    visitStore : Map.Map<Text, Nat>;
    educationStore : Map.Map<Nat, OldEducation>;
    var nextExperienceId : Nat;
    var nextSkillId : Nat;
    var nextProjectId : Nat;
    var nextEducationId : Nat;
    var profileSettings : ?OldProfileSettings;
    var contactSettings : ?OldContactSettings;
  };

  type NewActor = {
    reviewStore : Map.Map<Text, NewReview>;
    experienceStore : Map.Map<Text, NewExperience>;
    skillStore : Map.Map<Text, NewSkillCategory>;
    projectStore : Map.Map<Text, NewProject>;
    visitStore : Map.Map<Text, Nat>;
    educationStore : Map.Map<Text, NewEducation>;
    var adminPin : Text;
    var profileSettings : ?OldProfileSettings;
    var contactSettings : ?OldContactSettings;
    var nextReviewId : Nat;
    var nextExperienceId : Nat;
    var nextSkillId : Nat;
    var nextProjectId : Nat;
    var nextEducationId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    // Migrate reviews from Nat-keyed Map to Text-keyed Map
    let reviewStore = Map.empty<Text, NewReview>();
    for ((_, r) in old.reviewStore.entries()) {
      let textId = r.id.toText();
      reviewStore.add(textId, {
        id = textId;
        name = r.name;
        role = r.role;
        company = r.company;
        reviewText = r.reviewText;
        rating = r.rating;
        timestamp = r.timestamp;
      });
    };

    // Migrate experiences from Nat-keyed Map to Text-keyed Map
    let experienceStore = Map.empty<Text, NewExperience>();
    for ((_, e) in old.experienceStore.entries()) {
      let textId = e.id.toText();
      experienceStore.add(textId, {
        id = textId;
        title = e.title;
        company = e.company;
        period = e.period;
        description = e.description;
        sortOrder = e.sortOrder;
      });
    };

    // Migrate skills from Nat-keyed Map to Text-keyed Map
    let skillStore = Map.empty<Text, NewSkillCategory>();
    for ((_, s) in old.skillStore.entries()) {
      let textId = s.id.toText();
      skillStore.add(textId, {
        id = textId;
        category = s.category;
        items = s.items;
        sortOrder = s.sortOrder;
      });
    };

    // Migrate projects from Nat-keyed Map to Text-keyed Map
    let projectStore = Map.empty<Text, NewProject>();
    for ((_, p) in old.projectStore.entries()) {
      let textId = p.id.toText();
      projectStore.add(textId, {
        id = textId;
        title = p.title;
        url = p.url;
        imageUrl = p.imageUrl;
        sortOrder = p.sortOrder;
      });
    };

    // Migrate visits (already Text keys)
    let visitStore = Map.empty<Text, Nat>();
    for ((date, count) in old.visitStore.entries()) {
      visitStore.add(date, count);
    };

    // Migrate educations from Nat-keyed Map to Text-keyed Map
    let educationStore = Map.empty<Text, NewEducation>();
    for ((_, edu) in old.educationStore.entries()) {
      let textId = edu.id.toText();
      educationStore.add(textId, {
        id = textId;
        degree = edu.degree;
        college = edu.college;
        year = edu.year;
        sortOrder = edu.sortOrder;
      });
    };

    {
      reviewStore;
      experienceStore;
      skillStore;
      projectStore;
      visitStore;
      educationStore;
      var adminPin = old.adminPin;
      var profileSettings = old.profileSettings;
      var contactSettings = old.contactSettings;
      var nextReviewId = old.reviewStore.size();
      var nextExperienceId = old.nextExperienceId;
      var nextSkillId = old.nextSkillId;
      var nextProjectId = old.nextProjectId;
      var nextEducationId = old.nextEducationId;
    };
  };
};
