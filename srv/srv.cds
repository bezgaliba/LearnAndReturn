using my.LandR from '../db/schema';

service LMSService @(path: '/browse', impl: './srv.js'){
    entity CourseCategory
        as projection on LandR.CourseCategory;
    entity Course
        as projection on LandR.Course;
    entity LearningObject
        as projection on LandR.LearningObject;
    entity LearningObjectType
        as projection on LandR.LearningObjectType;

    entity ReviewIndicator
        as projection on LandR.ReviewIndicator;   
}