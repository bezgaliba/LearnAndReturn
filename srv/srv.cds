using my.LandR from '../db/schema';
service LMSService @(path: '/browse'){
    entity CourseCategory
        as projection on LandR.CourseCategory;

    entity Course
        as projection on LandR.Course;

    entity Review
        as projection on LandR.Review;

    entity LearningObject
        as projection on LandR.LearningObject;

    entity CourseMaterial
        as projection on LandR.CourseMaterial;

}