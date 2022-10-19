using my.LandR from '../db/schema';
service LMSService @(path: '/browse'){
    entity CourseCategory
        as projection on LandR.CourseCategory;

    //@requires: ['Student', 'Instructor', 'Admin']
    entity Course
        as projection on LandR.Course;

    //@requires: ['Student', 'Instructor', 'Admin']

   // @requires: ['Student', 'Instructor', 'Admin']
    entity LearningObject
        as projection on LandR.LearningObject;

    //@requires: ['Student', 'Instructor', 'Admin']

}