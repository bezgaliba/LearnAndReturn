namespace LandR;
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
    Type : String(20);
    Content : String(1040);
    Description : String(480);
}

entity CourseMaterial {
    CourseID : Association to Course;
    LearningObjectID : Association to LearningObject;
}