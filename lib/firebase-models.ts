// Firestore data models and utility functions for Poll App

import {
  Timestamp,
  collection,
  doc,
  getDocs,
  setDoc,
  getDoc,
  addDoc,
  query,
  where,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export type PollOption = {
  id: string;
  text: string;
};

export type Poll = {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  createdAt: string; // ISO string
  expiresAt: string; // ISO string
  isActive: boolean;
  createdBy?: string;
};

export type Vote = {
  optionId: string;
  votedAt: string; // ISO string
};

// Firestore collection references
export const pollsCollection = collection(db, "polls");

// Utility: Get the active poll
export async function getActivePoll(): Promise<Poll | null> {
  const q = query(pollsCollection, where("isActive", "==", true));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  const data = docSnap.data();
  return {
    id: docSnap.id,
    question: data.question,
    options: data.options,
    totalVotes: data.totalVotes ?? 0,
    createdAt: data.createdAt,
    expiresAt: data.expiresAt,
    isActive: data.isActive,
    createdBy: data.createdBy,
  };
}

// Utility: Add a new poll (admin only)
export async function addPoll(poll: Omit<Poll, "id">): Promise<string> {
  const docRef = await addDoc(pollsCollection, poll);
  return docRef.id;
}

// Utility: Set a poll as active and deactivate others
export async function setActivePoll(pollId: string) {
  const allPolls = await getDocs(pollsCollection);
  for (const pollDoc of allPolls.docs) {
    await updateDoc(doc(db, "polls", pollDoc.id), {
      isActive: pollDoc.id === pollId,
    });
  }
}

// Utility: Add a vote to a poll
export async function addVote(pollId: string, vote: Vote, voteId: string) {
  const voteRef = doc(db, "polls", pollId, "votes", voteId);
  await setDoc(voteRef, vote);
}

// Utility: Get all votes for a poll
export async function getVotes(pollId: string): Promise<Vote[]> {
  const votesRef = collection(db, "polls", pollId, "votes");
  const snapshot = await getDocs(votesRef);
  return snapshot.docs.map((doc) => doc.data() as Vote);
}
