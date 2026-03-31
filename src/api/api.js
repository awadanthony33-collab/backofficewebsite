// ─────────────────────────────────────────────────────────
//  Central API utility
//  Usage: import { getAll, getById, create, update, remove }
// ─────────────────────────────────────────────────────────

const BASE_URL = 'http://localhost:54608/api';

// ── Get headers ───────────────────────────────────────────
const getHeaders = () => ({
  'Content-Type': 'application/json',
});

// ── GET all records ───────────────────────────────────────
export const getAll = async (endpoint) => {
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error(`GET ${endpoint} failed`);
  return response.json();
};

// ── GET one record by ID ──────────────────────────────────
export const getById = async (endpoint, id) => {
  const response = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error(`GET ${endpoint}/${id} failed`);
  return response.json();
};

// ── POST — create new record ──────────────────────────────
export const create = async (endpoint, data) => {
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`POST ${endpoint} failed`);
  return response.json();
};

// ── PUT — update existing record ──────────────────────────
export const update = async (endpoint, id, data) => {
  const response = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`PUT ${endpoint}/${id} failed`);
};

// ── DELETE — remove record ────────────────────────────────
export const remove = async (endpoint, id) => {
  const response = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error(`DELETE ${endpoint}/${id} failed`);
};