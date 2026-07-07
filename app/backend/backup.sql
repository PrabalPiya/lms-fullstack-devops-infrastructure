--
-- PostgreSQL database dump
--

\restrict FSNni41oTrpekgfkuEc5jvBjUn3Jd0kDQQN4aK5mfRAjpbKCmKV1ArMu0zyPEH1

-- Dumped from database version 18.4 (Ubuntu 18.4-0ubuntu0.26.04.1)
-- Dumped by pg_dump version 18.4 (Ubuntu 18.4-0ubuntu0.26.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: CourseLevel; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CourseLevel" AS ENUM (
    'BEGINNER',
    'INTERMEDIATE',
    'ADVANCED'
);


ALTER TYPE public."CourseLevel" OWNER TO postgres;

--
-- Name: EnrollmentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EnrollmentStatus" AS ENUM (
    'ACTIVE',
    'COMPLETED',
    'DROPPED'
);


ALTER TYPE public."EnrollmentStatus" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'INSTRUCTOR',
    'STUDENT'
);


ALTER TYPE public."Role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description text NOT NULL,
    category text NOT NULL,
    level public."CourseLevel" DEFAULT 'BEGINNER'::public."CourseLevel" NOT NULL,
    "imageUrl" text,
    published boolean DEFAULT true NOT NULL,
    "authorId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.courses OWNER TO postgres;

--
-- Name: enrollments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.enrollments (
    id text NOT NULL,
    "userId" text NOT NULL,
    "courseId" text NOT NULL,
    status public."EnrollmentStatus" DEFAULT 'ACTIVE'::public."EnrollmentStatus" NOT NULL,
    "enrolledAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "completedAt" timestamp(3) without time zone
);


ALTER TABLE public.enrollments OWNER TO postgres;

--
-- Name: lesson_progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lesson_progress (
    id text NOT NULL,
    "userId" text NOT NULL,
    "lessonId" text NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    "completedAt" timestamp(3) without time zone,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.lesson_progress OWNER TO postgres;

--
-- Name: lessons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lessons (
    id text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    "videoUrl" text,
    "order" integer NOT NULL,
    "courseId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.lessons OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    "passwordHash" text NOT NULL,
    role public."Role" DEFAULT 'STUDENT'::public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
4eb53e36-6caa-451d-b50c-f37849f29f94	b850e80db281768c9d352868cc630dd9ab764929bc0e261dcfee7563913b141d	2026-07-07 03:44:26.512228+00	20260707034426_init	\N	\N	2026-07-07 03:44:26.49451+00	1
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courses (id, title, slug, description, category, level, "imageUrl", published, "authorId", "createdAt", "updatedAt") FROM stdin;
cmra3vamq0004u4zuijvi6x7c	DevOps Fundamentals	devops-fundamentals	Learn the core ideas of DevOps, CI/CD, containers, infrastructure automation, and production monitoring.	DevOps	BEGINNER	https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200	t	cmra3vakl0001u4zu6upfa5n0	2026-07-07 03:44:53.906	2026-07-07 03:44:53.906
cmra3vamz0009u4zujxev2gew	Modern React with TypeScript	modern-react-with-typescript	Build professional frontend applications using React, TypeScript, reusable components, hooks, routing, and API integration.	Frontend	INTERMEDIATE	https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200	t	cmra3vakl0001u4zu6upfa5n0	2026-07-07 03:44:53.915	2026-07-07 03:44:53.915
cmra3van5000eu4zun9qeoazb	Backend APIs with Node.js	backend-apis-with-nodejs	Learn how to build REST APIs using Node.js, Express, TypeScript, validation, authentication, and database access.	Backend	BEGINNER	https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200	t	cmra3vaik0000u4zu14whro2j	2026-07-07 03:44:53.921	2026-07-07 03:44:53.921
\.


--
-- Data for Name: enrollments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.enrollments (id, "userId", "courseId", status, "enrolledAt", "completedAt") FROM stdin;
cmra3vanb000ju4zuncpga30x	cmra3vamj0002u4zujozw4ek3	cmra3vamq0004u4zuijvi6x7c	ACTIVE	2026-07-07 03:44:53.927	\N
\.


--
-- Data for Name: lesson_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lesson_progress (id, "userId", "lessonId", completed, "completedAt", "updatedAt") FROM stdin;
cmra3vanh000lu4zud20k8c03	cmra3vamj0002u4zujozw4ek3	cmra3vamq0005u4zu5hxup9ww	t	2026-07-07 03:44:53.933	2026-07-07 03:44:53.934
\.


--
-- Data for Name: lessons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lessons (id, title, content, "videoUrl", "order", "courseId", "createdAt", "updatedAt") FROM stdin;
cmra3vamq0005u4zu5hxup9ww	What is DevOps?	DevOps is a way of building and operating software where development and operations work together. The goal is to deliver reliable software faster using automation, feedback, and continuous improvement.	\N	1	cmra3vamq0004u4zuijvi6x7c	2026-07-07 03:44:53.906	2026-07-07 03:44:53.906
cmra3vamq0006u4zuwhrlcsix	CI/CD Pipeline Basics	A CI/CD pipeline automatically builds, tests, and deploys code. It helps teams reduce manual errors and release changes safely.	\N	2	cmra3vamq0004u4zuijvi6x7c	2026-07-07 03:44:53.906	2026-07-07 03:44:53.906
cmra3vamq0007u4zuj3yez4y7	Containers and Images	Containers package an application with everything it needs to run. Docker images are used to build repeatable application environments.	\N	3	cmra3vamq0004u4zuijvi6x7c	2026-07-07 03:44:53.906	2026-07-07 03:44:53.906
cmra3vamz000au4zuorapzzvj	React Project Structure	A clean React project separates pages, components, API utilities, hooks, and shared types. This makes the app easier to maintain as it grows.	\N	1	cmra3vamz0009u4zujxev2gew	2026-07-07 03:44:53.915	2026-07-07 03:44:53.915
cmra3vamz000bu4zula5029nq	Working with Forms	Forms collect user input and send data to APIs. Controlled components make form state predictable in React.	\N	2	cmra3vamz0009u4zujxev2gew	2026-07-07 03:44:53.915	2026-07-07 03:44:53.915
cmra3vamz000cu4zurmmb5dii	API Calls with Axios	Axios is commonly used to call backend APIs. It can also attach authentication tokens to each request using interceptors.	\N	3	cmra3vamz0009u4zujxev2gew	2026-07-07 03:44:53.915	2026-07-07 03:44:53.915
cmra3van5000fu4zuy3htzc1t	Express Routing	Express routes receive HTTP requests and return responses. Routes should be organized by feature for cleaner backend architecture.	\N	1	cmra3van5000eu4zun9qeoazb	2026-07-07 03:44:53.921	2026-07-07 03:44:53.921
cmra3van5000gu4zusid454fl	Authentication with JWT	JWT authentication sends a signed token to the frontend after login. The frontend includes the token when making protected requests.	\N	2	cmra3van5000eu4zun9qeoazb	2026-07-07 03:44:53.921	2026-07-07 03:44:53.921
cmra3van5000hu4zuuw47ca3h	Database Access with Prisma	Prisma provides a type-safe way to interact with a database. It uses a schema file to define models and relationships.	\N	3	cmra3van5000eu4zun9qeoazb	2026-07-07 03:44:53.921	2026-07-07 03:44:53.921
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, "passwordHash", role, "createdAt", "updatedAt") FROM stdin;
cmra3vaik0000u4zu14whro2j	Admin User	admin@learnhub.local	$2a$10$AGO0rr/LtJW54AplWnWooOmkGLwG.7vuBli.QArRoc.SChclqw/5i	ADMIN	2026-07-07 03:44:53.756	2026-07-07 03:44:53.756
cmra3vakl0001u4zu6upfa5n0	Anita Instructor	instructor@learnhub.local	$2a$10$GV2meNhIcm.keZFLVtrsGOBGEl6rrbcd.pDWwkohLP5Zl.pOPniTy	INSTRUCTOR	2026-07-07 03:44:53.829	2026-07-07 03:44:53.829
cmra3vamj0002u4zujozw4ek3	Prabal Student	student@learnhub.local	$2a$10$hjyNOh.N0Yud8s5xW6Q1yOTq.VcLdTtiDHoQi/rcYppm6aZjC9ht.	STUDENT	2026-07-07 03:44:53.899	2026-07-07 03:44:53.899
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: enrollments enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_pkey PRIMARY KEY (id);


--
-- Name: lesson_progress lesson_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT lesson_progress_pkey PRIMARY KEY (id);


--
-- Name: lessons lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: courses_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX courses_slug_key ON public.courses USING btree (slug);


--
-- Name: enrollments_userId_courseId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "enrollments_userId_courseId_key" ON public.enrollments USING btree ("userId", "courseId");


--
-- Name: lesson_progress_userId_lessonId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "lesson_progress_userId_lessonId_key" ON public.lesson_progress USING btree ("userId", "lessonId");


--
-- Name: lessons_courseId_order_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "lessons_courseId_order_key" ON public.lessons USING btree ("courseId", "order");


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: courses courses_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT "courses_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: enrollments enrollments_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT "enrollments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: enrollments enrollments_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT "enrollments_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: lesson_progress lesson_progress_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT "lesson_progress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public.lessons(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: lesson_progress lesson_progress_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT "lesson_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: lessons lessons_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT "lessons_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict FSNni41oTrpekgfkuEc5jvBjUn3Jd0kDQQN4aK5mfRAjpbKCmKV1ArMu0zyPEH1

