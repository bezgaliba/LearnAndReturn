namespace my.LandR;
using { cuid, sap.common.CodeList } from '@sap/cds/common';

entity CourseCategory : cuid, CodeList {
}

entity Course : cuid {
    CourseName : String(100);
    Description : String(480);
    CourseCategory : Association to CourseCategory;
}

entity Review : cuid {
    Rating : String(5);
    Comment : String(960);
    Course : Association to Course;
}

entity LearningObject : cuid{
    Name : String(200);
    Type : String(20);
    Content : String(3040);
    Description : String(480);
}

entity CourseMaterial {
    Course : Association to Course;
    LearningObject : Association to LearningObject;
}