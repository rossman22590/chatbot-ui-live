export interface LearningFile {
  id: string;
  name: string;
  type: 'link' | 'document';
  url?: string;
  tags: string;
  folderId?: string;
  timestamp: string;
}

export interface Namespace {
  namespace: string;
}

export interface LearningResponse {
  message: string;
  metadata: LearningResponseMetadata[];
}

export interface LearningResponseMetadata {
  excerpt: 'The rugged and roomy cabin features front and rear climate controls.The interior features vegan leather and optional ash wood accents.Spacious back row with room for up to three child car seats.Easily adjustable front seats for a comfortable ride on any surface.Spacious center console with wireless inductive charger.A fully immersive sound system with speakers throughout the cabin.Take in the beauty of the world with our all-glass panoramic roof.A completely connected vehicle.The R1T is designed to be a fully connected experience, with  in-vehicle software and app working together to help you get where you’re going safely and comfortably.View Software SpotlightsGear Guard securityWe created the Gear Guard security system for Rivian vehicles to give you greater peace of mind on all your adventures.The Rivian appThe mobile app turns your phone into a key and a control center, unlocking features that help you get more from your vehicle.Vehicle updatesYour vehicle’s integrated software can be easily updated with new features that improve your experience over time.Driver+Standard with every vehicle we build, Driver+ offers driving assistance and a full set of safety features.';
  metadata: {
    description: 'Rivian is an electric vehicle manufacturer on a mission to keep the world adventurous forever.';
    language: 'en';
    source: 'https://rivian.com/r1t';
    title: 'R1T - Rivian';
  };
}
