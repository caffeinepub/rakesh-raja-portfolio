import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Array "mo:core/Array";

module {
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

  type Visit = {
    date : Text;
    count : Nat;
  };

  type OldActor = {
    reviews : Map.Map<Nat, Review>;
    dailyVisits : Map.Map<Text, Nat>;
    totalVisits : Nat;
    nextReviewId : Nat;
    adminPin : Text;
  };

  type NewActor = {
    reviewStore : Map.Map<Nat, Review>;
    experienceStore : Map.Map<Nat, Experience>;
    skillStore : Map.Map<Nat, SkillCategory>;
    projectStore : Map.Map<Nat, Project>;
    visitStore : Map.Map<Text, Nat>;
    nextExperienceId : Nat;
    nextSkillId : Nat;
    nextProjectId : Nat;
    adminPin : Text;
  };

  public func run(old : OldActor) : NewActor {
    {
      reviewStore = old.reviews; // Preserve reviews in new field
      experienceStore = Map.empty<Nat, Experience>(); // Initialize other maps as empty
      skillStore = Map.empty<Nat, SkillCategory>();
      projectStore = Map.empty<Nat, Project>();
      visitStore = old.dailyVisits; // Preserve dailyVisits in new field
      nextExperienceId = 0;
      nextSkillId = 0;
      nextProjectId = 0;
      adminPin = old.adminPin; // Preserve existing admin PIN
    };
  };
};
