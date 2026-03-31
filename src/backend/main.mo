import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Order "mo:core/Order";
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

  let reviews = Map.empty<Nat, Review>();
  var nextReviewId = 0;

  var totalVisits : Nat = 0;
  let dailyVisits = Map.empty<Text, Nat>();

  var adminPin : Text = "rakesh2025";

  func compareReviewsByTimeDesc(a : Review, b : Review) : Order.Order {
    Int.compare(b.timestamp, a.timestamp);
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
    switch (reviews.get(id)) {
      case (null) { Runtime.trap("Review not found") };
      case (?r) { r };
    };
  };

  public shared func submitReview(name : Text, role : Text, company : Text, reviewText : Text, rating : Nat) : async Nat {
    if (name == "") { Runtime.trap("Name cannot be empty") };
    if (reviewText == "") { Runtime.trap("Review text cannot be empty") };
    if (rating < 1 or rating > 5) { Runtime.trap("Rating must be 1-5") };
    let review : Review = {
      id = nextReviewId;
      name; role; company; reviewText; rating;
      timestamp = Time.now();
    };
    reviews.add(nextReviewId, review);
    nextReviewId += 1;
    review.id;
  };

  public shared func deleteReview(pin : Text, id : Nat) : async Bool {
    if (pin != adminPin) { return false };
    switch (reviews.get(id)) {
      case (null) { false };
      case (?_) {
        let _ = reviews.remove(id);
        true;
      };
    };
  };

  public query func getReviews() : async [Review] {
    reviews.values().sort(compareReviewsByTimeDesc).toArray();
  };

  public shared func recordVisit(dateStr : Text) : async () {
    totalVisits += 1;
    let current = switch (dailyVisits.get(dateStr)) {
      case (null) { 0 };
      case (?n) { n };
    };
    dailyVisits.add(dateStr, current + 1);
  };

  public query func getTotalVisits() : async Nat {
    totalVisits;
  };

  public query func getDailyVisits() : async [(Text, Nat)] {
    dailyVisits.entries().toArray();
  };

  public query func getReviewCount() : async Nat {
    reviews.size();
  };
};
