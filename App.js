
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
} from 'react-native';

export default function App() {
  const { width } = useWindowDimensions();
  const isCompact = width < 600;
  const dashboardColumnFlex = [1.2, 0.55, 1.5, 0.9, 1.3];
  const [activePage, setActivePage] = useState('registration');

  // Form states
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [isEmployed, setIsEmployed] = useState(false);
  const [selectedJob, setSelectedJob] = useState('');
  const [customJob, setCustomJob] = useState('');
  const [jobMessage, setJobMessage] = useState('');
  const [isJobMessageError, setIsJobMessageError] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [registrationResult, setRegistrationResult] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const isNameInvalid = name.length > 0 && !/^[a-zA-Z\s]+$/.test(name.trim());
  const isAddressInvalid = address.length > 0 && !/^[a-zA-Z\s]+$/.test(address.trim());
  const isCustomJobInvalid = customJob.length > 0 && !/^[a-zA-Z\s]+$/.test(customJob.trim());
  const isAgeNonNumeric = age.length > 0 && !/^\d+$/.test(age);
  const isAgeBelowMinimum = /^\d+$/.test(age) && Number(age) < 18;
  const isAgeInvalid = isAgeNonNumeric || isAgeBelowMinimum;

  // Job dropdown states
  const [jobs, setJobs] = useState([
    'Web Developer',
    'Software Engineer',
    'IT Specialist',
  ]);

  const [showJobs, setShowJobs] = useState(false);

  const clearSubmissionFeedback = () => {
    setSubmitError('');
    setRegistrationResult(null);
  };

  // Add a custom job
  const addJob = () => {
    clearSubmissionFeedback();
    const newJob = customJob.trim();

    if (!newJob) {
      setJobMessage('Please enter a job title.');
      setIsJobMessageError(true);
      return;
    }

    if (!/^[a-zA-Z\s]+$/.test(newJob)) {
      setJobMessage('Must me be a string');
      setIsJobMessageError(true);
      return;
    }

    if (jobs.some(job => job.toLowerCase() === newJob.toLowerCase())) {
      setJobMessage('This job already exists.');
      setIsJobMessageError(true);
      return;
    }

    setJobs(currentJobs => [...currentJobs, newJob]);
    setSelectedJob(newJob);
    setCustomJob('');
    setJobMessage('Job added. Select it from the dropdown.');
    setIsJobMessageError(false);
    setShowJobs(true);
  };

  // Submit registration
  const handleSubmit = () => {
    clearSubmissionFeedback();

    if (!name.trim() || !/^[a-zA-Z\s]+$/.test(name.trim())) {
      setSubmitError('Invalid name. Use letters and spaces only.');
      return;
    }

    if (!age.trim()) {
      setSubmitError('Invalid age. Please enter your age.');
      return;
    }

    if (!/^\d+$/.test(age.trim())) {
      setSubmitError('Must me a number');
      return;
    }

    if (Number(age.trim()) < 18) {
      setSubmitError('Must be 18 years of age and above');
      return;
    }

    if (!address.trim()) {
      setSubmitError('Invalid address. Please enter your address.');
      return;
    }

    if (isAddressInvalid) {
      setSubmitError('Must me be a string');
      return;
    }

    if (isEmployed && !selectedJob) {
      setSubmitError('Please select a job before submitting.');
      return;
    }

    const normalizedName = name.trim().replace(/\s+/g, ' ').toLowerCase();
    if (registrations.some(
      registration => registration.name.trim().replace(/\s+/g, ' ').toLowerCase() === normalizedName
    )) {
      setSubmitError('A registration with this name already exists.');
      return;
    }

    const submittedRegistration = {
      name: name.trim().replace(/\s+/g, ' '),
      age: age.trim(),
      address: address.trim(),
      employed: isEmployed,
      job: isEmployed ? selectedJob : 'N/A',
    };

    setRegistrationResult(submittedRegistration);
    setRegistrations(currentRegistrations => [
      ...currentRegistrations,
      submittedRegistration,
    ]);
  };

  // Reset form
  const handleReset = () => {
    setName('');
    setAge('');
    setAddress('');
    setIsEmployed(false);
    setSelectedJob('');
    setCustomJob('');
    setJobMessage('');
    setShowJobs(false);
    clearSubmissionFeedback();
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#3e2723" barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Registration System</Text>
      </View>

      <View style={[styles.mainLayout, isCompact && styles.compactLayout]}>

        {/* SIDEBAR */}
        <View style={[styles.sidebar, isCompact && styles.compactSidebar]}>
          <TouchableOpacity onPress={() => setActivePage('dashboard')}>
            <Text style={[
              styles.sidebarItem,
              activePage === 'dashboard' && styles.activeItem,
              isCompact && activePage === 'dashboard' && styles.compactActiveItem,
            ]}>
              Dashboard
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActivePage('registration')}>
            <Text style={[
              styles.sidebarItem,
              activePage === 'registration' && styles.activeItem,
              isCompact && activePage === 'registration' && styles.compactActiveItem,
            ]}>
            Registration
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActivePage('about')}>
            <Text style={[
              styles.sidebarItem,
              activePage === 'about' && styles.activeItem,
              isCompact && activePage === 'about' && styles.compactActiveItem,
            ]}>
              About
            </Text>
          </TouchableOpacity>
        </View>

        {/* CONTENT */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentInner}
          keyboardShouldPersistTaps="handled"
        >
          {activePage === 'dashboard' ? (
            <View style={[styles.formCard, styles.dashboardCard]}>
              <Text style={styles.title}>Dashboard</Text>
              <Text style={styles.description}>Submitted registrations</Text>
              {registrations.length === 0 ? (
                <Text style={styles.emptyState}>
                  No registrations have been submitted yet.
                </Text>
              ) : (
                <View style={styles.table}>
                  <View style={[styles.tableRow, styles.tableHeaderRow]}>
                    {['Full Name', 'Age', 'Address', 'Employed', 'Job'].map((column, index) => (
                      <Text
                        key={column}
                        style={[
                          styles.tableCell,
                          styles.tableHeader,
                          { flex: dashboardColumnFlex[index] },
                        ]}
                      >
                        {column}
                      </Text>
                    ))}
                  </View>
                  {registrations.map((registration, index) => (
                    <View
                      key={`${registration.name}-${index}`}
                      style={styles.tableRow}
                    >
                      {[
                        registration.name,
                        registration.age,
                        registration.address,
                        registration.employed ? 'Yes' : 'No',
                        registration.job,
                      ].map((value, cellIndex) => (
                        <Text
                          key={cellIndex}
                          style={[
                            styles.tableCell,
                            { flex: dashboardColumnFlex[cellIndex] },
                          ]}
                        >
                          {value}
                        </Text>
                      ))}
                    </View>
                  ))}
                </View>
              )}
            </View>
          ) : activePage === 'about' ? (
            <View style={styles.formCard}>
              <Text style={styles.title}>About</Text>
              <Text style={styles.aboutText}>Module 1 - Performance Task Activity</Text>
              <Text style={styles.aboutText}>Submitted by: Allana Macatuno</Text>
              <Text style={styles.aboutText}>Section: WMAD 4A</Text>
            </View>
          ) : (
          <View style={styles.formCard}>
            <Text style={styles.title}>User Registration</Text>
            <Text style={styles.description}>
              Please fill out the form below.
            </Text>

            {/* NAME */}
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[styles.input, isNameInvalid && styles.invalidInput]}
              placeholder="Enter your full name"
              value={name}
              onChangeText={value => {
                setName(value);
                clearSubmissionFeedback();
              }}
            />
            {isNameInvalid && (
              <Text style={styles.validationError}>Must me be a string</Text>
            )}

            {/* AGE */}
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={[styles.input, isAgeInvalid && styles.invalidInput]}
              placeholder="Enter your age"
              value={age}
              onChangeText={value => {
                setAge(value);
                clearSubmissionFeedback();
              }}
              keyboardType="numeric"
            />
            {isAgeNonNumeric && (
              <Text style={styles.validationError}>Must me a number</Text>
            )}
            {isAgeBelowMinimum && (
              <Text style={styles.validationError}>
                Must be 18 years of age and above
              </Text>
            )}

            {/* ADDRESS */}
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, isAddressInvalid && styles.invalidInput]}
              placeholder="Enter your address"
              value={address}
              onChangeText={value => {
                setAddress(value);
                clearSubmissionFeedback();
              }}
            />
            {isAddressInvalid && (
              <Text style={styles.validationError}>* Must me be a string</Text>
            )}

            {/* EMPLOYMENT CHECKBOX */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => {
                setIsEmployed(!isEmployed);
                setSelectedJob('');
                setShowJobs(false);
                clearSubmissionFeedback();
              }}
            >
              <View style={[
                styles.checkbox,
                isEmployed && styles.checkedBox
              ]}>
                {isEmployed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxText}>Is Employed?</Text>
            </TouchableOpacity>

            {/* CONDITIONAL JOB DROPDOWN */}
            {isEmployed && (
              <View>
                <Text style={styles.label}>Select Job</Text>

                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowJobs(!showJobs)}
                >
                  <Text style={styles.dropdownText}>
                    {selectedJob || 'Select your job'}
                  </Text>
                  <Text style={styles.arrow}>
                    {showJobs ? '▲' : '▼'}
                  </Text>
                </TouchableOpacity>

                {showJobs && (
                  <View style={styles.dropdownList}>
                    {jobs.map(job => (
                      <TouchableOpacity
                        key={job}
                        style={styles.dropdownOption}
                        onPress={() => {
                          setSelectedJob(job);
                          setShowJobs(false);
                          clearSubmissionFeedback();
                        }}
                      >
                        <Text style={styles.optionText}>{job}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* CUSTOM JOB */}
                <Text style={styles.label}>Custom Job</Text>
                <TextInput
                  style={[styles.input, isCustomJobInvalid && styles.invalidInput]}
                  placeholder="Enter another job title"
                  value={customJob}
                  onChangeText={value => {
                    setCustomJob(value);
                    setJobMessage('');
                    clearSubmissionFeedback();
                  }}
                />
                {isCustomJobInvalid && (
                  <Text style={styles.validationError}>* Must me be a string</Text>
                )}

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={addJob}
                >
                  <Text style={styles.buttonText}>+ Add Job</Text>
                </TouchableOpacity>
                {!!jobMessage && (
                  <Text
                    style={[
                      styles.jobMessage,
                      isJobMessageError && styles.jobErrorMessage,
                    ]}
                  >
                    {jobMessage}
                  </Text>
                )}
              </View>
            )}

            {/* BUTTONS */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Submit Registration</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
            >
              <Text style={styles.resetText}>Reset Form</Text>
            </TouchableOpacity>

            {!!submitError && (
              <Text style={styles.submitError}>{submitError}</Text>
            )}

            {registrationResult && (
              <View style={styles.resultCard}>
                <Text style={styles.resultTitle}>Registration Successful</Text>
                <Text style={styles.resultText}>Name: {registrationResult.name}</Text>
                <Text style={styles.resultText}>Age: {registrationResult.age}</Text>
                <Text style={styles.resultText}>Address: {registrationResult.address}</Text>
                <Text style={styles.resultText}>
                  Employed: {registrationResult.employed ? 'Yes' : 'No'}
                </Text>
                <Text style={styles.resultText}>Job: {registrationResult.job}</Text>
              </View>
            )}

          </View>
          )}
        </ScrollView>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2026 Registration System | ITST 306
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0e8',
  },

  header: {
    backgroundColor: '#3e2723',
    padding: 20,
    paddingTop: 35,
  },

  headerTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
  },

  mainLayout: {
    flex: 1,
    flexDirection: 'row',
  },

  compactLayout: {
    flexDirection: 'column',
  },

  sidebar: {
    width: 105,
    backgroundColor: '#6f4e37',
    padding: 10,
    paddingTop: 25,
  },

  compactSidebar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingVertical: 4,
    paddingTop: 4,
  },

  sidebarItem: {
    color: '#f5f0e8',
    paddingVertical: 12,
    fontSize: 12,
  },

  compactActiveItem: {
    paddingHorizontal: 10,
  },

  activeItem: {
    color: '#ffffff',
    fontWeight: 'bold',
    backgroundColor: '#8d6e63',
    paddingHorizontal: 5,
    borderRadius: 5,
  },

  content: {
    flex: 1,
  },

  contentInner: {
    padding: 15,
    flexGrow: 1,
  },

  formCard: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 12,
    elevation: 3,
  },

  dashboardCard: {
    flex: 1,
    width: '100%',
  },

  title: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#3e2723',
  },

  description: {
    color: '#795548',
    marginTop: 5,
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5d4037',
    marginBottom: 7,
    marginTop: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: '#d7ccc8',
    borderRadius: 7,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#ffffff',
  },

  invalidInput: {
    borderColor: '#b3261e',
  },

  validationError: {
    color: '#b3261e',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },

  checkbox: {
    width: 21,
    height: 21,
    borderWidth: 1.5,
    borderColor: '#8d6e63',
    borderRadius: 4,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkedBox: {
    backgroundColor: '#795548',
    borderColor: '#795548',
  },

  checkmark: {
    color: '#ffffff',
    fontWeight: 'bold',
  },

  checkboxText: {
    color: '#5d4037',
    fontSize: 14,
  },

  dropdown: {
    borderWidth: 1,
    borderColor: '#d7ccc8',
    borderRadius: 7,
    padding: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dropdownText: {
    color: '#5d4037',
    fontSize: 14,
  },

  arrow: {
    color: '#8d6e63',
  },

  dropdownList: {
    borderWidth: 1,
    borderColor: '#d7ccc8',
    borderRadius: 7,
    marginTop: 5,
    overflow: 'hidden',
  },

  dropdownOption: {
    padding: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#efebe9',
  },

  optionText: {
    color: '#5d4037',
  },

  addButton: {
    backgroundColor: '#6d4c41',
    padding: 12,
    borderRadius: 7,
    alignItems: 'center',
    marginTop: 10,
  },

  jobMessage: {
    color: '#5d4037',
    fontSize: 12,
    marginTop: 6,
  },

  jobErrorMessage: {
    color: '#b3261e',
  },

  submitButton: {
    backgroundColor: '#8b5e3c',
    padding: 14,
    borderRadius: 7,
    alignItems: 'center',
    marginTop: 25,
  },

  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },

  resetButton: {
    padding: 13,
    alignItems: 'center',
    marginTop: 5,
  },

  resetText: {
    color: '#795548',
    fontWeight: '600',
  },

  submitError: {
    color: '#b3261e',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },

  resultCard: {
    backgroundColor: '#f5f0e8',
    borderColor: '#8b5e3c',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 12,
    padding: 14,
  },

  resultTitle: {
    color: '#3e2723',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  resultText: {
    color: '#5d4037',
    fontSize: 14,
    marginTop: 3,
  },

  emptyState: {
    color: '#795548',
    fontSize: 14,
    paddingVertical: 18,
  },

  aboutText: {
    color: '#5d4037',
    fontSize: 16,
    marginTop: 10,
  },

  tableRow: {
    flexDirection: 'row',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#d7ccc8',
  },

  tableHeaderRow: {
    backgroundColor: '#6f4e37',
  },

  table: {
    width: '100%',
  },

  tableCell: {
    color: '#5d4037',
    fontSize: 12,
    minWidth: 0,
    paddingHorizontal: 5,
    paddingVertical: 12,
  },

  tableHeader: {
    color: '#ffffff',
    fontWeight: 'bold',
  },

  footer: {
    backgroundColor: '#3e2723',
    padding: 14,
    alignItems: 'center',
  },

  footerText: {
    color: '#d7ccc8',
    fontSize: 11,
  },
});
