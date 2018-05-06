$(document).ready(function(){
  $('.delete-user').on('click', function(e) {
    $target = $(e.target);
    let id = $target.attr('data-id');
    $.ajax({
      type:"DELETE",
      url: '/users/admin_user'+id,
      success: function(response) {
        alert('Deleting User');
           window.location.href='/users/administrators';
       },
       error: function(err){
           console.log(err);
      }
    });
  });
});

$(document).ready(function(){
  $('.delete-article').on('click', function(e) {
    $target = $(e.target);
    let id = $target.attr('data-id');
    $.ajax({
      type:"DELETE",
      url: '/users/edit_article'+id,
      success: function(response) {
        alert('Deleting article');
           window.location.href='/users/articles';
       },
       error: function(err){
           console.log(err);
      }
    });
  });
});
