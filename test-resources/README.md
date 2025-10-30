# Test Resources for InterviewPilot

This directory contains fake resumes and job descriptions for testing the InterviewPilot AI interview application. These resources help you test various interview scenarios without needing to create test data manually.

## Directory Structure

```
test-resources/
├── resumes/              # Fake resume files for testing
│   ├── senior-fullstack-engineer.txt
│   ├── junior-frontend-developer.txt
│   ├── backend-engineer-python.txt
│   ├── devops-engineer.txt
│   ├── bootcamp-graduate-career-changer.txt
│   └── data-engineer.txt
├── job-descriptions/     # Sample job postings
│   ├── senior-fullstack-position.txt
│   ├── junior-frontend-position.txt
│   ├── backend-engineer-position.txt
│   ├── devops-engineer-position.txt
│   └── data-engineer-position.txt
└── README.md            # This file
```

## Resumes

All resumes are provided in TXT format for easy upload and parsing. Each resume represents a different career level and specialization:

### 1. Senior Full-Stack Engineer (`senior-fullstack-engineer.txt`)
- **Experience Level**: 7+ years
- **Skills**: React, Vue.js, Node.js, TypeScript, AWS
- **Best For**: Testing senior-level full-stack interviews
- **Key Highlights**: Microservices, leadership, mentoring experience

### 2. Junior Frontend Developer (`junior-frontend-developer.txt`)
- **Experience Level**: 1.5 years
- **Skills**: React, JavaScript, HTML/CSS, Material-UI
- **Best For**: Testing entry-level frontend interviews
- **Key Highlights**: Recent graduate, learning mindset, portfolio projects

### 3. Backend Engineer - Python (`backend-engineer-python.txt`)
- **Experience Level**: 4 years
- **Skills**: Python, FastAPI, Django, PostgreSQL, AWS, Kafka
- **Best For**: Testing backend-focused interviews
- **Key Highlights**: Microservices, API development, performance optimization

### 4. DevOps Engineer (`devops-engineer.txt`)
- **Experience Level**: 5 years
- **Skills**: Kubernetes, Terraform, AWS, CI/CD, Monitoring
- **Best For**: Testing infrastructure and DevOps interviews
- **Key Highlights**: Cloud architecture, automation, multiple certifications

### 5. Bootcamp Graduate / Career Changer (`bootcamp-graduate-career-changer.txt`)
- **Experience Level**: 6 months coding (6+ years project management)
- **Skills**: React, Node.js, MongoDB, JavaScript
- **Best For**: Testing career transition scenarios
- **Key Highlights**: Business background, transferable skills, recent bootcamp grad

### 6. Data Engineer (`data-engineer.txt`)
- **Experience Level**: 3 years
- **Skills**: Python, Spark, Kafka, Airflow, Snowflake, AWS
- **Best For**: Testing data engineering interviews
- **Key Highlights**: ETL pipelines, big data, data warehousing

## Job Descriptions

Job descriptions are paired with resumes to create realistic interview scenarios:

### 1. Senior Full-Stack Position (`senior-fullstack-position.txt`)
- **Company**: TechVision Inc (SaaS)
- **Salary Range**: $150k-$200k
- **Tech Stack**: React, TypeScript, Node.js, PostgreSQL, AWS
- **Pairs Well With**: senior-fullstack-engineer.txt

### 2. Junior Frontend Position (`junior-frontend-position.txt`)
- **Company**: Creative Web Studio (Agency)
- **Salary Range**: $60k-$75k
- **Tech Stack**: React, HTML/CSS, Tailwind, JavaScript
- **Pairs Well With**: junior-frontend-developer.txt

### 3. Backend Engineer Position (`backend-engineer-position.txt`)
- **Company**: DataStream Analytics (Data Platform)
- **Salary Range**: $110k-$150k
- **Tech Stack**: Python, FastAPI, PostgreSQL, Kafka, AWS
- **Pairs Well With**: backend-engineer-python.txt

### 4. DevOps Engineer Position (`devops-engineer-position.txt`)
- **Company**: CloudScale Solutions (Infrastructure)
- **Salary Range**: $130k-$180k
- **Tech Stack**: Kubernetes, Terraform, AWS, Jenkins, Prometheus
- **Pairs Well With**: devops-engineer.txt

### 5. Data Engineer Position (`data-engineer-position.txt`)
- **Company**: InsightData Corp (Business Intelligence)
- **Salary Range**: $100k-$140k
- **Tech Stack**: Python, Spark, Snowflake, Airflow, AWS
- **Pairs Well With**: data-engineer.txt

## Usage Instructions

### Basic Usage

1. **Start the InterviewPilot application**:
   ```bash
   npm run dev
   ```

2. **Upload a resume**:
   - Click "Upload Resume" on the interview page
   - Select any `.txt` file from the `test-resources/resumes/` directory

3. **Fill in job details**:
   - Copy the job title, company name, and requirements from corresponding job description file
   - Or manually type in custom details

4. **Start the interview**:
   - Click "Start Interview" to begin
   - The AI will generate questions based on the resume and job description

### Recommended Test Scenarios

#### Scenario 1: Entry-Level Interview
- **Resume**: `junior-frontend-developer.txt`
- **Job**: `junior-frontend-position.txt`
- **Focus**: Basic JavaScript, React fundamentals, learning attitude
- **Expected Questions**: HTML/CSS basics, React hooks, responsive design

#### Scenario 2: Senior Technical Interview
- **Resume**: `senior-fullstack-engineer.txt`
- **Job**: `senior-fullstack-position.txt`
- **Focus**: System design, architecture, leadership
- **Expected Questions**: Scalability, microservices, team management

#### Scenario 3: Career Transition
- **Resume**: `bootcamp-graduate-career-changer.txt`
- **Job**: `junior-frontend-position.txt`
- **Focus**: Transferable skills, motivation, quick learning
- **Expected Questions**: Project experience, bootcamp projects, adaptability

#### Scenario 4: Specialized Role
- **Resume**: `data-engineer.txt`
- **Job**: `data-engineer-position.txt`
- **Focus**: ETL, data pipelines, big data technologies
- **Expected Questions**: Spark, data modeling, pipeline optimization

#### Scenario 5: Infrastructure Focus
- **Resume**: `devops-engineer.txt`
- **Job**: `devops-engineer-position.txt`
- **Focus**: Kubernetes, CI/CD, infrastructure as code
- **Expected Questions**: Container orchestration, monitoring, automation

### Testing Different AI Behaviors

You can test how the AI interviewer responds to various situations:

- **Mismatched Skills**: Use a resume with different skills than the job requires
- **Overqualified Candidate**: Use senior-fullstack-engineer.txt for junior-frontend-position.txt
- **Underqualified Candidate**: Use junior-frontend-developer.txt for senior-fullstack-position.txt
- **Career Change**: Use bootcamp-graduate-career-changer.txt to test transferable skills assessment

### Custom Prompts

Try different system prompts to test AI behavior:
- **Friendly interviewer**: "You are a friendly and encouraging interviewer"
- **Technical deep-dive**: "Focus on deep technical questions and problem-solving"
- **Behavioral focus**: "Ask behavioral and situational questions"
- **Mixed interview**: "Balance technical questions with cultural fit assessment"

## Tips for Effective Testing

1. **Start with matching pairs**: Begin with resume/job pairs that align well (e.g., senior-fullstack-engineer.txt with senior-fullstack-position.txt)

2. **Test edge cases**: Try mismatched combinations to see how the AI adapts

3. **Vary your responses**:
   - Try technical answers to see scoring
   - Try vague answers to see follow-up questions
   - Try incorrect answers to test feedback quality

4. **Monitor the score**: Watch how the score changes (baseline 50/100, ±3 points per response)

5. **Review transcripts**: Download transcripts to analyze interview quality

6. **Test different formats**: All resumes are in TXT format, which is supported along with PDF

## Adding New Test Resources

To add your own test resources:

### Adding a Resume
1. Create a new `.txt` file in `test-resources/resumes/`
2. Include: name, contact, summary, skills, experience, education
3. Use realistic but fake information
4. Follow the format of existing resumes

### Adding a Job Description
1. Create a new `.txt` file in `test-resources/job-descriptions/`
2. Include: job title, company, responsibilities, qualifications, tech stack, compensation
3. Make it detailed enough to generate good interview questions

## Notes

- All resumes contain **fictional information** and should not be treated as real candidates
- Contact information (emails, phone numbers) are fake
- Company names and URLs are fictional or generic
- These resources are for **testing purposes only**
- Feel free to modify or create new test resources based on your needs

## File Format

All files use `.txt` format for simplicity and compatibility with the InterviewPilot resume parser. The application also supports PDF format if you want to convert these files.

## Feedback

If you create useful test resources or have suggestions for additional scenarios, consider adding them to this directory!
