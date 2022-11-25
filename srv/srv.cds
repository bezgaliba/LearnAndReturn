using my.LandR from '../db/schema';

service LMSService @(path: '/browse', impl: './srv.js', requires: 'authenticated-user'){
    entity CourseCategory @(restrict: [
            {
                grant: '*',
                to: 'Admin'
            },
            {
                grant: ['READ', 'CREATE'],
                to: 'Instructor'
            },
            {
                grant: ['UPDATE', 'DELETE'],
                where: 'createdBy = $user',
                to: 'Instructor'
            },
            {
                grant: 'READ',
                to: 'Student'
            },
    ])
        as projection on LandR.CourseCategory;
    entity Course @(restrict: [
            {
                grant: '*',
                to: 'Admin'
            },
            {
                grant: ['READ', 'CREATE'],
                to: 'Instructor'
            },
            {
                grant: ['UPDATE', 'DELETE'],
                where: 'createdBy = $user',
                to: 'Instructor'
            },
            {
                grant: 'READ',
                to: 'Student'
            },
    ])
        as projection on LandR.Course;
    entity LearningObject @(restrict: [
            {
                grant: '*',
                to: 'Admin'
            },
            {
                grant: ['READ', 'CREATE'],
                to: 'Instructor'
            },
            {
                grant: ['UPDATE', 'DELETE'],
                where: 'createdBy = $user',
                to: 'Instructor'
            },
            {
                grant: 'READ',
                to: 'Student'
            }
    ])
        as projection on LandR.LearningObject;
    entity LearningObjectType @(restrict: [
            {
                grant: '*',
                to: 'Admin'
            },
            {
                grant: 'READ',
                to: 'Instructor'
            },
            {
                grant: 'READ',
                to: 'Student'
            }
    ])
        as projection on LandR.LearningObjectType;
}