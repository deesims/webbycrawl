+-- SQL in section 'Up' is executed when this migration is applied
 +CREATE TABLE smartboard_activities (
 +  id SERIAL NOT NULL,
 +  title VARCHAR(255),
 +  type VARCHAR(255),
 +  body TEXT,
 +  user_id INTEGER REFERENCES users(id),
 +  created_at TIMESTAMP,
 +  updated_at TIMESTAMP,
 +  deleted_at TIMESTAMP,
 +  PRIMARY KEY(id)
 +);
 +
 +CREATE TABLE smartboard_questions(
 +      id SERIAL NOT NULL,
 +      smartboard_activity_id INTEGER REFERENCES smartboard_activities(id),
 +      body TEXT,
 +      answer INTEGER, -- if applicable depending on the type of activity
 +      created_at TIMESTAMP,
 +      updated_at TIMESTAMP,
 +      deleted_at TIMESTAMP,
 +      PRIMARY KEY(id)
 +);
 +
 +CREATE TABLE smartboard_answers(
 +      id SERIAL NOT NULL,
 +      smartboard_question_id INTEGER REFERENCES smartboard_questions(id),
 +      body TEXT,
 +      created_at TIMESTAMP,
 +      updated_at TIMESTAMP,
 +      deleted_at TIMESTAMP,
 +      PRIMARY KEY(id)
 +);
 +
 +-- +goose Down
 +-- SQL section 'Down' is executed when this migration is rolled back
 +DROP TABLE IF EXISTS smartboard_activities;
 +DROP TABLE IF EXISTS smartboard_questions;
 +DROP TABLE IF EXISTS smartboard_answers;
