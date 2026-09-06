export interface SampleResume {
  id: string;
  name: string;
  role: string;
  fileName: string;
  fileSize: number;
  text: string;
}

export const SAMPLE_RESUMES: SampleResume[] = [
  {
    id: 'sample-data-analyst',
    name: 'Alex Rivera (Data Analyst)',
    role: 'Data Analyst',
    fileName: 'Alex_Rivera_Data_Analyst_Resume.pdf',
    fileSize: 425000,
    text: `ALEX RIVERA
San Francisco, CA • alex.rivera.analytics@email.com • (555) 342-9812 • linkedin.com/in/alexrivera-data

PROFESSIONAL SUMMARY
Motivated Data Analyst with 3 years of experience transforming raw enterprise datasets into strategic business dashboards and automated reports. Proficient in SQL, Python, Excel, and Power BI with a passion for exploratory data analysis and statistical modeling.

TECHNICAL SKILLS
• Programming & Querying: Python (Pandas, NumPy, Matplotlib, Seaborn), SQL (PostgreSQL, MySQL, BigQuery)
• BI & Visualization: Power BI, Tableau, Excel (Advanced Formulas, PivotTables, Power Query, VBA)
• Methodologies: Exploratory Data Analysis (EDA), Statistical Hypothesis Testing, A/B Testing, Data Cleaning
• Tools: Git, GitHub, Jupyter Notebooks, JIRA, Snowflake

WORK EXPERIENCE
Junior Data Analyst | Apex Retail Group | Austin, TX
July 2023 - Present
• Designed and deployed 14 interactive Power BI dashboards tracking omnichannel sales, customer retention, and inventory velocity across 45 regional stores.
• Wrote complex SQL queries involving multi-table joins, subqueries, and window functions to query Postgres database of 2.4M customer transactions.
• Automated weekly revenue reporting pipelines using Python and Pandas scripts, cutting manual preparation time from 6 hours to 25 minutes weekly.
• Conducted cohort analysis to identify seasonal churn patterns, providing actionable insights that contributed to a 7% lift in repeat customer purchases.

Data Analytics Intern | NorthStar Logistics | Dallas, TX
January 2023 - June 2023
• Assisted Senior Business Intelligence Analysts in cleansing, restructuring, and validating supply chain datasets.
• Built Excel dashboards with dynamic macros and slicers to visualize carrier on-time delivery rates.
• Evaluated logistics KPIs across 12 distribution centers and identified delivery bottlenecks in Midwest regional hubs.

ACADEMIC PROJECTS
Customer Segmentation & Lifetime Value Predictor (Python, Scikit-learn, Seaborn)
• Analyzed e-commerce dataset containing 500,000 transactions using RFM (Recency, Frequency, Monetary) modeling.
• Applied K-Means clustering algorithm to segment customers into 4 distinct behavioral clusters.
• Visualized cluster distributions using Seaborn and presented strategic retention recommendations.

COVID-19 Global Trends Tracker & Dashboard (SQL, Tableau, Excel)
• Cleaned and harmonized public health time-series datasets spanning 180 countries.
• Published an interactive Tableau public dashboard with drill-down geographic maps and 7-day rolling case averages.

EDUCATION
Bachelor of Science in Information Systems & Business Analytics
University of Texas at Dallas | Graduated December 2022
GPA: 3.75 / 4.00
Relevant Coursework: Relational Database Management, Business Statistics, Predictive Analytics, Applied Python

CERTIFICATIONS
• Google Data Analytics Professional Certificate (Coursera)
• Microsoft Certified: Power BI Data Analyst Associate (PL-300)`,
  },
  {
    id: 'sample-ml-engineer',
    name: 'Maya Chen (Machine Learning Engineer)',
    role: 'ML Engineer',
    fileName: 'Maya_Chen_ML_Engineer.docx',
    fileSize: 580000,
    text: `MAYA CHEN
Seattle, WA • maya.chen.ai@email.com • (555) 789-2143 • github.com/mayachen-ai • linkedin.com/in/mayachen-ml

SUMMARY
Machine Learning Engineer with 2+ years of experience designing, training, and deploying deep learning models. Solid background in PyTorch, Python, Scikit-learn, HuggingFace transformers, and MLOps container pipelines.

CORE COMPETENCIES
• Languages & Frameworks: Python, C++, PyTorch, TensorFlow, Scikit-learn, NumPy, HuggingFace, FastAPI
• ML Disciplines: Natural Language Processing (NLP), Computer Vision, Feature Engineering, Hyperparameter Optimization
• MLOps & Cloud: Docker, Kubernetes, MLflow, AWS (S3, EC2, SageMaker), Git, CI/CD pipelines
• Databases: PostgreSQL, Pinecone, Redis, ChromaDB

EXPERIENCE
Associate Machine Learning Engineer | CloudVision AI | Seattle, WA
August 2023 - Present
• Implemented and fine-tuned BERT and RoBERTa models for multi-label text classification across 120,000 legal contracts, achieving an 89.4% F1-score.
• Containerized model inference pipelines using FastAPI and Docker, serving 450+ model inference requests per minute with under 85ms p95 latency.
• Monitored production model drift and automated retrain pipelines utilizing MLflow and GitHub Actions.
• Optimized PyTorch model weights via ONNX runtime quantization, reducing model memory footprint by 42% on AWS EC2 instances.

Machine Learning Researcher | University AI Laboratory | Seattle, WA
September 2022 - June 2023
• Researched few-shot learning techniques in transformer architectures under faculty supervision.
• Co-authored research paper on domain adaptation in biomedical Named Entity Recognition (NER).

PROJECTS
Autonomous Document Summarizer & Semantic Search (PyTorch, LangChain, Pinecone)
• Built a retrieval-augmented generation (RAG) system utilizing OpenAI & HuggingFace sentence transformers to index 15,000 research whitepapers.
• Integrated hybrid vector search using Pinecone and BM25 to deliver low-latency semantic answers with citation highlights.

Real-Time Defect Detection with YOLOv8 (Computer Vision, OpenCV, PyTorch)
• Trained custom object detection model on 8,000 industrial manufacturing images to classify component defects.
• Reached 94.2% mAP@50 and deployed inference loop on edge devices running at 32 FPS.

EDUCATION
Master of Science in Computer Science (Machine Learning Specialization)
University of Washington | 2023
Bachelor of Science in Computer Engineering | 2021`,
  },
  {
    id: 'sample-fullstack-dev',
    name: 'David Kim (Full Stack Developer)',
    role: 'Full Stack Developer',
    fileName: 'David_Kim_FullStack_Resume.pdf',
    fileSize: 390000,
    text: `DAVID KIM
New York, NY • david.kim.dev@email.com • (555) 431-6789 • github.com/davidkim • davidkim.dev

PROFESSIONAL SUMMARY
Full Stack Software Developer with 4 years of experience engineering scalable web applications and RESTful/GraphQL microservices. Experienced in React, TypeScript, Next.js, Node.js, Express, and PostgreSQL.

SKILLS
• Frontend: React 18, Next.js, TypeScript, JavaScript (ES6+), Tailwind CSS, Redux Toolkit, HTML5/CSS3
• Backend: Node.js, Express, Python, RESTful APIs, GraphQL, Microservices, Prisma ORM
• Databases: PostgreSQL, MongoDB, Redis, Supabase
• Cloud & Tools: AWS (S3, CloudFront), Docker, Jest, Cypress, Git, CI/CD

EXPERIENCE
Software Engineer | FinFlow Systems | New York, NY
April 2022 - Present
• Engineered mission-critical merchant onboarding dashboard using React, TypeScript, and Tailwind CSS, adopted by 12,000+ SMB merchants nationwide.
• Built high-throughput Node.js microservices processing payment webhooks with Redis caching, supporting 1,200 RPS during peak transactional hours.
• Reduced client-side initial bundle size by 35% through dynamic code-splitting, tree-shaking, and asset optimization in Next.js.
• Authored comprehensive unit and integration test suites in Jest and Cypress, elevating test coverage from 58% to 84%.

Junior Web Developer | PixelCraft Media | Brooklyn, NY
June 2020 - March 2022
• Developed responsive marketing sites and client portals using React, Express, and MongoDB.
• Implemented OAuth2 authentication and role-based access control (RBAC) across 8 client applications.
• Collaborated in an agile scrum team of 7 engineers, participating in bi-weekly sprints, code reviews, and pair programming.

EDUCATION
Bachelor of Science in Computer Science
Stony Brook University, NY | Graduated May 2020`,
  },
];
