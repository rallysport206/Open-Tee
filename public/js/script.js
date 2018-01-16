$('.delete-course').click(function(e) {
  e.preventDefault();
  $.ajax({
    url: $(this).attr('action'),
    method: 'DELETE',
  }).done(function(data){
    window.location.href = '/profile';
  });
});
