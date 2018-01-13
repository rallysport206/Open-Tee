$('.delete-fav').click(function(e) {
  e.preventDefault();
  $.ajax({
    url: $(this).attr('action'),
    method: 'DELETE'
  }).success(function(data){
    window.location.href = '/profile';
  });
});
