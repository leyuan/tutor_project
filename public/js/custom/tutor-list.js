new Vue({
    el: '#tutor-list',
    beforeMount() {
        var url = `${window.location.origin}/api/tutors`;
        this.$http.get(url).then(function (res) {
            if (res.body) {
                var body = JSON.parse(res.body);
                sortTutorCourses(body);
                var tutorList = filterTutors(body);
                this.$set(this.$data, 'tutorResponseBody', body);
                this.$set(this.$data, 'tutorList', tutorList);
            }
        });

        var fetch_subject_url = `${window.location.origin}/api/subjects`;
        this.$http.get(fetch_subject_url).then(function (res) {
            if (res.body) {
                var body = JSON.parse(res.body);
                this.$set(this.$data, 'subjects', body.subjects.sort());
            }
        });

        ga('send', 'event', 'Users', 'View', 'Subject: ' + (window.location.hash.substring(1) || 'All')); // track subject 
    },
    data: {
        tutorResponseBody: [],
        tutorList: [],
        subjects: [],
        selected: window.location.hash.substring(1) || 'All'
    },
    methods: {
        doThis(event) {
            var selectedCourse = this._data.selected;
            var body = this._data.tutorResponseBody;
            var tutorList = filterTutors(body, selectedCourse);
            this.$set(this._data, 'tutorList', tutorList);

            ga('send', 'event', 'Users', 'View', 'Subject: ' + selectedCourse); // track subject 
        }
    }
});

function filterTutors(tutorList, course) {
    var selectedCourse = course || window.location.hash.substring(1) || '';

    return tutorList.filter(function (stub) {
        stub["link"] = `teachers-profile.html#${stub.id}`;
        var tutor = stub.source;
        var tutorSubjects = getTutorSubjects(tutor);

        if (selectedCourse === '' || selectedCourse === 'All') {
            return true;
        }
        return tutorSubjects.indexOf(selectedCourse.toLowerCase()) >= 0;
    });
}

function getTutorSubjects(tutor) {
  var subjects = tutor.courses.map(function (course) {
    return course.split(' ')[0].toLowerCase();
  });
  return _.uniq(subjects);
}

function sortTutorCourses(tutorList) {
    if (!tutorList) return;
    return tutorList.map(function (tutor) {
      return tutor.source.courses.sort();
    });
}
