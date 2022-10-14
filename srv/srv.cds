using my.LandR from '../db/schema';
service LMSService @(path: '/browse'){
    entity CourseCategory
        as projection on LandR.CourseCategory;

    @requires: ['Student', 'Instructor', 'Admin']
    entity Course
        as projection on LandR.Course;

    @requires: ['Student', 'Instructor', 'Admin']
    entity Review
        as projection on LandR.Review;

    @requires: ['Student', 'Instructor', 'Admin']
    entity LearningObject
        as projection on LandR.LearningObject;

    @requires: ['Student', 'Instructor', 'Admin']
    entity CourseMaterial
        as projection on LandR.CourseMaterial;

}