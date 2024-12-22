import React, { useState, useCallback, useEffect } from "react";
import phone from "phone";
import { memoize } from 'lodash';

export function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

// Function to validate website (URL) format
export function validateWebsite(url) {
  const urlPattern = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
  return urlPattern.test(url);
}

// Function to validate phone number format
export function validatePhoneNumber(phoneNumber) {
  const phonePattern =
    /^(\+?\d{1,4}[\s-]?)?((\(\d{1,4}\))|\d{1,4})[\s-]?\d{1,4}[\s-]?\d{1,9}$/;
  return phonePattern.test(phoneNumber);
}

export function validateUSPhoneNumber(phoneNumber) {
  const res = phone(phoneNumber, { country: 'USA' })
  return res.isValid
}

export function validatePassword(password) {
  // Define regular expressions for each requirement
  const minLengthRegex = /.{7,}/;
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

  // Initialize an array to store missing requirements
  const missingRequirements = [];

  // Check each requirement and add to the missing list if not met
  if (!minLengthRegex.test(password)) {
    missingRequirements.push('at least 7 characters');
  }
  if (!uppercaseRegex.test(password)) {
    missingRequirements.push('at least 1 uppercase letter');
  }
  if (!lowercaseRegex.test(password)) {
    missingRequirements.push('at least 1 lowercase letter');
  }
  if (!specialCharRegex.test(password)) {
    missingRequirements.push('at least 1 special character');
  }

  // Return an object with validation status and missing requirements
  return {
    isValid: missingRequirements.length === 0,
    missing: missingRequirements,
  };
}

export function generatePassword() {
  const minLength = 7;
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const specialChars = '!@#$%^&*(),.?":{}|<>';

  let password = '';
  password += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
  password += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];

  const allChars = uppercaseChars + lowercaseChars + specialChars + '0123456789';
  for (let i = password.length; i < minLength; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle password to ensure randomness
  password = password.split('').sort(() => Math.random() - 0.5).join('');
  return password;
}

export const formattedNumber = (number, decimals = 2) => {
  if (isNaN(number)) return '0.00';
  return Number(number).toFixed(decimals);
};

export const memoizedOrderName = memoize(
  (ordererInfo) => {
    if (!ordererInfo) return '';
    if (typeof ordererInfo === 'string') {
      ordererInfo = ordererInfo.split(" ");
      return `${ordererInfo[0]} ${ordererInfo[1][0]}`;
    }
    const { firstName, lastName } = ordererInfo;
    return `${firstName || ''} ${lastName[0] || ''}`.trim();
  },
  (ordererInfo) => {
    // Custom resolver for the memoize cache key
    if (!ordererInfo) return 'empty';
    if (typeof ordererInfo === 'string') {
      ordererInfo = ordererInfo.split(" ");
      return `${ordererInfo[0]} ${ordererInfo[1] ? ordererInfo[1][0] : ""}`;
    }
    return `${ordererInfo.firstName || ''}-${ordererInfo.lastName || ''}`;
  }
);

// Function to scroll to the top of the page
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// Function to scroll to the bottom of the page
export const scrollToBottom = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
  });
};