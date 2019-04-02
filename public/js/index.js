$(document).ready(function() {

    const showNotes = (articleId) => {
        $("#new-note").val("")
        // console.log(articleId)
        $(".note-container").empty();
        $.ajax({
            method: "GET",
            url: "/articles/" + articleId
        }).then(function(data) {
            // console.log(data.note);
            for (let i in data.note) {
                let note = $("<li class='list-group-item'>");
                note.text(data.note[i].body);
                let deleteButton = $("<button class='btn btn-danger float-right deleteNote'>");
                deleteButton.text("Delete");
                deleteButton.attr('data-id', data.note[i]._id);
                note.append(deleteButton);
                $(".note-container").append(note);
            }
        })
        $(".addNote").attr("data-id", articleId)
        $("#notes-modal").modal("show")
    };

    const deleteArticle = (articleId) => {
        $.ajax({
            method: "DELETE",
            url: "/articles/" + articleId
        })
          .then(function(data) {
            // console.log("deleted")
            // console.log(data)

            location.reload();
        })
    }

    const deleteNote = (noteId) => {
        $.ajax({
            method: "DELETE",
            url: "/notes/" + noteId
        }).then(function(response) {
            console.log(response);
        })
    }

    const scrapeClickhole = () => {
        $.ajax({
            method: "GET",
            url: "/scrape"
        }).then(function() {
            location.reload();
        })
    }

    const addNote = (articleId) => {
        let newNoteContent = $("#new-note").val().trim();
        console.log(newNoteContent)
        $.ajax({
            method: "POST",
            url: "/articles/" + articleId,
            data: {
                body: newNoteContent
            }
        })
    }

    $(".notes").click(function() {
        const articleId = $(this).attr("data-id");
        showNotes(articleId);
    });

    $(".scrape-new").click(scrapeClickhole);

    $(".addNote").click(function () {
        const articleId = $(this).attr("data-id");
        addNote(articleId)
        $("#notes-modal").modal("hide")
    });
   
    $(".delete").click(function() {
        const articleId = $(this).attr("data-id");
        deleteArticle(articleId);
    })

    $("body").on('click', "button.deleteNote", function() {
        const noteId = $(this).attr("data-id")
        deleteNote(noteId);
        $("#notes-modal").modal("hide");
    })
})

